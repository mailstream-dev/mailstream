import SMTPCommand from "../models/SMTPCommand";
import Request from "../models/Request";
import Response from "../models/Response";

class QUIT extends SMTPCommand {
  constructor() {
    super("QUIT");
  }

  command(req: Request, res: Response): void {
    const match = this.buffer.toString().match(/^QUIT\b$/im);

    if (match) {
      res.end(221, `See ya later!`, req.encoding);

      return;
    }

    res.send(501, "QUIT does not accept additional parameters", req.encoding);
  }
}

export default new QUIT();
