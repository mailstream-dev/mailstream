import Request from "../models/Request";
import Response from "../models/Response";
import SMTPCommand from "../models/SMTPCommand";

class NOOP extends SMTPCommand {
  constructor() {
    super("NOOP");
  }

  command(req: Request, res: Response): void {
    const match = this.buffer.toString().match(/^NOOP\b$/im);

    if (match) {
      res.send(
        250,
        `${
          req.remoteHostname || req.remoteAddress
        } used NOOP, but nothing happened`,
        req.encoding
      );
      return;
    }

    res.send(501, "NOOP does not accept additional parameters", req.encoding);
  }
}

export default new NOOP();
