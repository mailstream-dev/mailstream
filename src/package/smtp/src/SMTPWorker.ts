import { Socket } from "net";
import { Observable } from "observable-fns";

import MailObject from "./models/MailObject";
import Request from "./models/Request";
import Response from "./models/Response";
import SMTPError from "./models/SMTPError";
import SMTPStream from "./SMTPStream";

const repipe = (
  req: Request,
  res: Response,
  socket: Socket,
  callback: (email: MailObject) => void
) => {
  const sink = new SMTPStream(req, res);

  sink.on("email", callback);

  sink.on("error", (e) => {
    socket.unpipe(sink);
    if (e instanceof SMTPError) {
      res.send(e.code, e.message, req.encoding);
      repipe(req, res, socket, callback);
    } else {
      throw e;
    }
  });

  socket.pipe(sink);
};

const Worker = (socket: Socket) => {
  const req = new Request("ascii", socket.remoteAddress);
  const res = new Response(socket);
  const observer = new Observable<MailObject>((o) => {
    socket.on("end", () => {
      o.complete();
    });

    socket.on("error", (e) => {
      o.error(e);
    });

    socket.write("220 - Welcome!\r\n", "ascii", (e) => {
      socket.setEncoding("ascii"); //7-bit MIME
      repipe(req, res, socket, (e) => o.next(e));
      socket.resume();
    });

    return socket.destroy.bind(socket);
  });

  return observer;
};

export default Worker;
