import { TypeUtil } from "@mailstream/util";

import Request from "../models/Request";
import Response from "../models/Response";
import SMTPCommand from "../models/SMTPCommand";

class EHLO extends SMTPCommand {
  constructor() {
    super("EHLO");
  }

  command(req: Request, res: Response): void {
    const match = this.buffer.toString().match(/^EHLO ([a-z0-9\-.]{1,253})$/im);

    if (match && TypeUtil.isNonEmptyString(match?.[1])) {
      req.setRemoteHostName(match[1]);
      res.send(
        250,
        `Hello ${match[1]} [${req.remoteAddress}], whatcha got for me?`,
        req.encoding
      );

      req.plugins.map((p) => {
        res.send(250, p, req.encoding);
      });

      return;
    }

    res.send(501, "Invalid Hostname", req.encoding);
  }
}

export default new EHLO();
