import { TypeUtil } from "@mailstream/util";

import MailObject from "../models/MailObject";
import Request from "../models/Request";
import Response from "../models/Response";
import SMTPCommand from "../models/SMTPCommand";

class MAIL extends SMTPCommand {
  constructor() {
    super("RCPT TO:");
  }

  override validState(req: Request, currentObject: MailObject): boolean {
    return Boolean(currentObject?.from?.length);
  }

  command(req: Request, res: Response): Partial<MailObject> {
    const match = this.buffer.toString().match(/^RCPT TO:([\w\W]*)\r\n$/i);

    if (match && TypeUtil.isNonEmptyString(match?.[1])) {
      res.send(250, `ok`, req.encoding);
      return { recipients: [match[1]] };
    }

    res.send(501, "Invalid TO address", req.encoding);
    return null;
  }
}

export default new MAIL();
