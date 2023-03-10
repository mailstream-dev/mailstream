import { createServer, Server, Socket } from "net";
import { Observable } from "observable-fns";
import { createServer as createSecureServer } from "tls";

import repo from "./models/CommandRepository";
import MailObject from "./models/MailObject";
import SMTPPlugin from "./models/SMTPPlugin";
import Worker from "./SMTPWorker";

interface SMTPOptions {
  ip: string;
  port: number;
  plugins: SMTPPlugin[];
  key?: Buffer;
  cert?: Buffer;
  ca?: Buffer;
}

const defaultOptions: SMTPOptions = {
  ip: "127.0.0.1",
  port: 25,
  plugins: [],
};

class SMTPServer {
  private options: SMTPOptions;
  private server: Server;

  constructor(
    handler: (message: MailObject) => void,
    options?: Partial<SMTPOptions>
  ) {
    this.options = { ...defaultOptions, ...(options || {}) };

    this.options.plugins.forEach((p) => repo.register(p));

    const serverOptions = {
      pauseOnConnect: true,
      key: options.key,
      cert: this.options.cert,
      ca: this.options.ca,
    };
    const secure = Boolean(this.options.cert?.byteLength);

    this.server = secure
      ? createSecureServer(serverOptions)
      : createServer(serverOptions);

    const trackedEvent = secure ? "secureConnection" : "connection";

    this.server.on(trackedEvent, async (socket: Socket) => {
      const observer: Observable<MailObject> = Worker(socket);
      observer.subscribe(handler.bind(this));
    });
  }

  listen(callback?: () => void) {
    const { ip: host, port } = this.options;
    this.server.listen({ host, port, exclusive: true }, callback);
  }
}

export default SMTPServer;
