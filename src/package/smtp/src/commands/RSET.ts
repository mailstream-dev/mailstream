import Request from "../models/Request";
import Response from "../models/Response";
import SMTPCommand from "../models/SMTPCommand";
import SMTPError from "../models/SMTPError";

class RSET extends SMTPCommand {
  constructor() {
    super("RSET");
  }

  command(req: Request, res: Response): void {
    const match = this.buffer.toString().match(/^RSET\b$/im);

    if (match) {
      throw new SMTPError(250, "Server is Reset");
    }

    res.send(501, "RSET does not accept additional parameters", req.encoding);
  }
}

export default new RSET();
