abstract class SMTPCommand {
  private buffer = Buffer.alloc(0);

  constructor(public name: string, private terminator = "\r\n") {}

  write(line: Buffer): boolean {
    this.buffer = Buffer.concat(this.buffer, line);
    return line.toString().endsWith(this.terminator);
  }
}
