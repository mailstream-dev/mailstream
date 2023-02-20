import fs from "fs";
import path from "path";

import { SMTPServer } from "@mailstream/smtp";

const options = {
  key: fs.readFileSync(
    path.resolve(__dirname, "../../../local-assets/server-key.pem")
  ),
  cert: fs.readFileSync(
    path.resolve(__dirname, "../../../local-assets/server-cert.pem")
  ),
  ca: fs.readFileSync(
    path.resolve(__dirname, "../../../local-assets/server-csr.pem")
  ),
  port: 8587,
  useSSL: true,
};

new SMTPServer(options).listen(() => {
  console.log(`Listening on ${options.port}`);
});
