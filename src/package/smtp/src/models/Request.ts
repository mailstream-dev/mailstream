class Request {
  private _remoteHostname = "";
  constructor(
    private _encoding: BufferEncoding,
    public remoteAddress: string
  ) {}

  setEncoding(encoding: BufferEncoding) {
    this._encoding = encoding;
  }

  setRemoteHostName(name: string) {
    this._remoteHostname = name;
  }

  get encoding(): BufferEncoding {
    return this._encoding;
  }

  get remoteHostname(): string {
    return this._remoteHostname;
  }
}

export default Request;
