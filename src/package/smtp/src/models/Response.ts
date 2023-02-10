import { Socket } from "net";

class Response {
  constructor(private socket: Socket, private encoding: BufferEncoding) {}

  send(code: number, message: string): Promise<void> {
    return new Promise((resolve, reject) =>
      this.socket.write(
        Buffer.from(`${code}- ${message}`, this.encoding),
        this.encoding,
        (e) => (e ? reject(e) : resolve())
      )
    );
  }

  async end(code: number, message: string): Promise<void> {
    await this.send(code, message);
    this.socket.destroy();
  }
}

export default Response;
