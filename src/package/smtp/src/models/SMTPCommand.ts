import MailObject from "./MailObject";
import Request from "./Request";
import Response from "./Response";

type CommandResult = Partial<MailObject> | void;

abstract class SMTPCommand {
  protected buffer: Buffer = Buffer.alloc(0);

  /**
   * Instructs the server to emit the message and reset the request state if
   * true. Defaults to false.
   *
   * @type {Boolean}
   */
  public shouldEmit = false;

  constructor(public name: string, private terminator = "\r\n") {}

  /**
   * Ensures preconditions are met for a given command
   *
   * @param {Request} req Current Request State Object, used to check request
   *   properties are set (i.e. MAIL FROM: command requires HELO to set
   *   remoteHostname)
   * @param {MailObject} currentObject Current Mail Object, used to check if
   *   required properties exist (i.e. Data requires from and to addresses to be
   *   filled)
   * @returns {boolean} True if state is valid else False
   */
  validState(req: Request, currentObject: MailObject): boolean;
  validState(): boolean {
    return true;
  }

  /**
   * Function to reset working state of the command. Automatically run after
   * every command execution
   *
   * Override this if the command has any additional stateful properties besides
   * buffer
   */
  protected resetState() {
    this.buffer = Buffer.alloc(0);
  }

  /**
   * Write chunk of data from socket to the commands internal buffer
   *
   * @param {Buffer} line Data from the socket
   * @param {Request} req Request State
   * @param {Response} res Response Object
   * @returns {boolean} True if the buffer represents a fully-formed command,
   *   otherwise false if the buffers should continue to pack data before
   *   execution
   */
  write(line: Buffer, req: Request, res: Response): boolean {
    this.buffer = Buffer.concat([this.buffer, line]);
    return this.buffer.toString().endsWith(this.terminator);
  }

  /**
   * Command execution function. This will be run when the internal buffer
   * contains a fully-formed command. This should parse the command buffer, then
   * update the request state and/or return a partial MailObject if necessary.
   *
   * @param {Request} req Request State
   * @param {Response} res Response Object
   * @returns {CommandResult} Void | Partial<MailObject>, returns just the
   *   updated portion of the mail object which will be merged into the working
   *   object
   */
  protected abstract command(req: Request, res: Response): CommandResult;

  /**
   * Called by the SMTP Stream. Should not be overridden, all logic should be
   * placed in the `command`` function
   *
   * @param {Request} req Request State
   * @param {Response} res Response Object
   * @returns {CommandResult} See `command` function
   */
  call(req: Request, res: Response): CommandResult {
    const rslt = this.command(req, res);
    this.resetState();
    return rslt;
  }
}

export { CommandResult };
export default SMTPCommand;
