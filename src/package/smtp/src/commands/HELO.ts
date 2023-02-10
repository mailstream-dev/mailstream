import { TypeUtil } from "@mailstream/util";

import SMTPCommand from "../models/SMTPCommand";
import Request from "../models/Request";
import Response from "../models/Response";

class HELO extends SMTPCommand {
  constructor() {
    super("HELO");
  }

  command(req: Request, res: Response): void {
    const match = this.buffer
      .toString()
      .match(/^HELO ([a-z0-9\-.]{1,253})(?!\.)\b*$/m);

    if (match && TypeUtil.isNonEmptyString(match?.[1])) {
      req.setRemoteHostName(match[1]);
      res.send(
        250,
        `Hello ${match[1]} [${req.remoteAddress}], whatcha got for me?`
      );
    }

    res.send(501, "Invalid Hostname");
  }
}

export default HELO;
