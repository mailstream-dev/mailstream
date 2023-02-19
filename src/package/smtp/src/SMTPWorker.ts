import { Socket } from "net";
import { Observable } from "observable-fns";
import Request from "./models/Request";
import Response from "./models/Response";
import SMTPStream from "./SMTPStream";

const Worker = (socket: Socket) => {
  socket.resume();
  socket.write("220- Welcome!\r\n", "ascii");
  socket.setEncoding("ascii"); //7-bit MIME
  const req = new Request("ascii", socket.remoteAddress);
  const res = new Response(socket);
  const observer = new Observable((observer) => {
    socket.on("end", () => {
      observer.complete();
    });
    socket.on("error", (e) => {
      observer.error(e);
    });
  });

  socket.pipe(new SMTPStream(req, res));

  return observer;
};

export default Worker;
