import { Writable, Readable } from "stream";
import SMTPCommand from "./models/SMTPCommand";
import repo from "./models/CommandRepository";
import Response from "./models/Response";
import Request from "./models/Request";
import SMTPError from "./models/SMTPError";
import "./SMTPWorker";
import MailObject, { merge } from "./models/MailObject";

interface State {
  command?: SMTPCommand;
  message: MailObject;
  buffer: Buffer;
}

const emptyMessage: MailObject = {
  recipients: [],
  from: null,
  body: null,
};

class SMTPStream extends Writable {
  private _state: State = {
    buffer: Buffer.alloc(0),
    message: emptyMessage,
  };

  private source: Readable = null;

  private get state(): State {
    return Object.freeze(this._state);
  }

  constructor(
    private req: Request,
    private res: Response,
    writableOptions?: Record<string, unknown>
  ) {
    super(writableOptions);

    this.on("pipe", (source) => {
      this.source = source;
    });
  }

  private setState(partial: Partial<State>) {
    this._state = { ...this.state, ...partial };
  }

  resume() {
    this.source?.pipe(this);
  }

  override _write(
    content: string,
    encoding: BufferEncoding,
    callback: (e?: Error) => void
  ): void;
  override _write(
    content: Buffer,
    encoding: string,
    callback: (e?: Error) => void
  ): void;
  override _write(
    content: string | Buffer,
    encoding: BufferEncoding | string,
    callback: (e?: Error) => void
  ): void {
    const data =
      content instanceof Buffer
        ? Buffer.concat([this.state.buffer, content])
        : Buffer.concat([
            this.state.buffer,
            Buffer.from(content as string, encoding as BufferEncoding),
          ]);

    const s = data.toString("utf-8");

    if (!this.state.command) {
      const [command = null] =
        s.match(
          new RegExp(
            `^(${repo
              .keys()
              .map((k) => `(?:${k})`)
              .join("|")})`,
            "im"
          )
        ) || [];

      if (!command?.length) {
        if (
          s.includes("\n") ||
          data.byteLength > Math.max(...repo.keys().map((k) => k.length))
        ) {
          return callback(
            new SMTPError(
              500,
              "No command could be inferred from the available data",
              { data: s }
            )
          );
        } else {
          this.setState({ buffer: data });
          return callback(null);
        }
      }

      const cmd = repo.get(command.toUpperCase());
      if (!cmd) {
        return callback(
          new SMTPError(
            500,
            "The server parsed a valid command, but couldn't decode your request",
            { command }
          )
        );
      }

      if (!cmd.validState(this.req, this.state.message)) {
        return callback(new SMTPError(503, "Precondition Failed", { command }));
      }

      this.setState({ command: cmd });
    }

    const readyForNextCommand = this.state.command.write(
      data,
      this.req,
      this.res
    );

    if (readyForNextCommand) {
      const partial: Partial<MailObject> =
        this.state.command.call(this.req, this.res) || {};

      const message = merge(this.state.message, partial);

      if (this.state.command.shouldEmit) {
        this.emit("email", message);

        this.setState({
          command: null,
          buffer: Buffer.alloc(0),
          message: emptyMessage,
        });
      } else {
        this.setState({
          command: null,
          buffer: Buffer.alloc(0),
          message,
        });
      }
    }

    return callback(null);
  }
}

export default SMTPStream;
