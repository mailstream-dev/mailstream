import Request from "./Request";
import Response from "./Response";
import MailObject from "./MailObject";

type CommandResult = Partial<MailObject> | void;

abstract class SMTPCommand {
  protected buffer: Buffer = Buffer.alloc(0);

  public shouldEmit = false;

  constructor(public name: string, private terminator = "\r\n") {}

  validState(currentObject: MailObject): boolean;
  validState(): boolean {
    return true;
  }

  write(line: Buffer, req: Request, res: Response): boolean {
    this.buffer = Buffer.concat([this.buffer, line]);
    return this.buffer.toString().endsWith(this.terminator);
  }

  protected abstract command(req: Request, res: Response): CommandResult;

  call(req: Request, res: Response): CommandResult {
    return this.command(req, res);
  }
}

export { CommandResult };
export default SMTPCommand;
