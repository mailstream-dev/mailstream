class SMTPError extends Error {
  constructor(
    readonly code: number,
    private msg: string,
    readonly context: Record<string, unknown> = null
  ) {
    super(msg);
  }

  override get message(): string {
    return `${this.code}: ${this.msg}` + this.context
      ? `\n${JSON.stringify(this.context, null, 2)}`
      : "";
  }
}

export default SMTPError;
