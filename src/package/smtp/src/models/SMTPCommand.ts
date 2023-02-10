import Request from "./Request";
import Response from "./Response";
import MailObject from "./MailObject";

abstract class SMTPCommand {
  protected buffer: Buffer = Buffer.alloc(0);

  constructor(public name: string, private terminator = "\r\n") {}

  write(line: Buffer): boolean {
    this.buffer = Buffer.concat([this.buffer, line]);
    return line.toString().endsWith(this.terminator);
  }

  abstract command(req: Request, res: Response): Partial<MailObject> | void;
}

export default SMTPCommand;
