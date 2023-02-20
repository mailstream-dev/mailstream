import { TypeUtil } from "@mailstream/util";

import SMTPCommand from "../models/SMTPCommand";
import Request from "../models/Request";
import Response from "../models/Response";
import MailObject from "../models/MailObject";

class DATA extends SMTPCommand {
  constructor() {
    super("DATA", "\r\n.\r\n");
  }

  override shouldEmit = true;

  override validState(currentObject: MailObject): boolean {
    return (
      Boolean(currentObject?.from?.length) &&
      Boolean(currentObject?.recipients?.filter(Boolean)?.length)
    );
  }

  override write(line: Buffer, req: Request, res: Response): boolean {
    const rslt = super.write(line, req, res);
    const match = this.buffer.toString().match(/^DATA\b\r\n$/i);
    if (match) {
      res.send(354, "Go Ahead...", req.encoding);
    }

    return rslt;
  }

  command(req: Request, res: Response): Partial<MailObject> {
    const match = this.buffer
      .toString()
      .match(/^DATA\b\r\n([\w\W]*)\r\n.\r\n$/im);
    if (match && TypeUtil.isNonEmptyString(match?.[1])) {
      res.send(250, "Got it, thanks!", req.encoding);
      return { body: match[1] };
    } else {
      res.send(501, "I'm confused...", req.encoding);
    }

    return null;
  }
}

export default new DATA();
