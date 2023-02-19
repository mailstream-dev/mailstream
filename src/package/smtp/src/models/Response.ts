import { Socket } from "net";

class Response {
  constructor(private socket: Socket) {}

  send(code: number, message: string, encoding: BufferEncoding): Promise<void> {
    return new Promise((resolve, reject) =>
      this.socket.write(`${code}- ${message}\r\n`, encoding, (e) =>
        e ? reject(e) : resolve()
      )
    );
  }

  async end(
    code: number,
    message: string,
    encoding: BufferEncoding
  ): Promise<void> {
    await this.send(code, message, encoding);
    this.socket.destroy();
  }
}

export default Response;
