import Request from "./Request";
import Response from "./Response";
import MailObject from "./MailObject";

type CommandResult = Partial<MailObject> | void;

abstract class SMTPCommand {
  protected buffer: Buffer = Buffer.alloc(0);

  constructor(public name: string, private terminator = "\r\n") {}

  write(line: Buffer): boolean {
    this.buffer = Buffer.concat([this.buffer, line]);
    return line.toString().endsWith(this.terminator);
  }

  protected abstract command(req: Request, res: Response): CommandResult;

  call(req: Request, res: Response): CommandResult {
    return this.command(req, res);
  }
}

export default SMTPCommand;
