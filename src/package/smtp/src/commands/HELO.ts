import { TypeUtil } from "@mailstream/util";

import SMTPCommand from "../models/SMTPCommand";
import Request from "../models/Request";
import Response from "../models/Response";

class HELO extends SMTPCommand {
  constructor() {
    super("HELO");
  }

  command(req: Request, res: Response): void {
    console.log(this.buffer.toString());

    const match = this.buffer.toString().match(/^HELO ([a-z0-9\-.]{1,253})$/im);

    if (match && TypeUtil.isNonEmptyString(match?.[1])) {
      req.setRemoteHostName(match[1]);
      res.send(
        250,
        `Hello ${match[1]} [${req.remoteAddress}], whatcha got for me?`,
        req.encoding
      );
      return;
    }

    res.send(501, "Invalid Hostname", req.encoding);
  }
}

export default new HELO();
