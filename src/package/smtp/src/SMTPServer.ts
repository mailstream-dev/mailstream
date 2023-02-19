import { createServer, Server, Socket } from "net";
import { createServer as createSecureServer } from "tls";
import { Observable } from "observable-fns";

import SMTPCommand from "./models/SMTPCommand";
import repo from "./models/CommandRepository";
import Worker from "./SMTPWorker";

type registerFn = (command: SMTPCommand) => void;

interface SMTPOptions {
  ip: string;
  port: number;
  plugins: Array<(register: registerFn) => Promise<void> | void>;
  useSSL: boolean;
  key?: Buffer;
  cert?: Buffer;
}

const defaultOptions: SMTPOptions = {
  ip: "127.0.0.1",
  port: 8025,
  plugins: [],
  useSSL: false,
};

class SMTPServer {
  private options: SMTPOptions;
  private server: Server;

  constructor(options?: Partial<SMTPOptions>) {
    this.options = { ...defaultOptions, ...(options || {}) };

    this.options.plugins.forEach((p) => p(repo.register));

    const serverOptions = { pauseOnConnect: true };
    this.server = this.options.useSSL
      ? createSecureServer(serverOptions)
      : createServer(serverOptions);

    this.server.on("connection", async (socket: Socket) => {
      const observer: Observable<unknown> = Worker(socket);
      observer.subscribe(this.onEmail.bind(this));
    });
  }

  onEmail(...args: unknown[]) {
    args.forEach(console.log);
  }

  listen(callback?: () => void) {
    const { ip: host, port } = this.options;
    this.server.listen({ host, port, exclusive: true }, callback);
  }
}

export default SMTPServer;
