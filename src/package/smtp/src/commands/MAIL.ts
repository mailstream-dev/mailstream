import { TypeUtil } from "@mailstream/util";

import MailObject from "../models/MailObject";
import Request from "../models/Request";
import Response from "../models/Response";
import SMTPCommand from "../models/SMTPCommand";

class MAIL extends SMTPCommand {
  constructor() {
    super("MAIL FROM:");
  }

  command(req: Request, res: Response): Partial<MailObject> {
    const match = this.buffer.toString().match(/^MAIL FROM:([\w\W]*)\r\n$/i);

    if (match && TypeUtil.isNonEmptyString(match?.[1])) {
      res.send(250, `ok`, req.encoding);
      return { from: match[1] };
    }

    res.send(501, "Invalid FROM address", req.encoding);
    return null;
  }
}

export default new MAIL();
