import { Socket } from "net";

class Response {
  constructor(private socket: Socket, private encoding: string) {}

  send(code: number, message: string): Promise<void> {
    return new Promise((resolve) =>
      this.socket.write(
        Buffer.from(`${code}- ${message}`, this.encoding),
        this.encoding,
        resolve
      )
    );
  }

  end(code: number, messagge: string): Promise<void> {
    await this.send(code, message);
    this.socket.destroySoon();
  }
}
