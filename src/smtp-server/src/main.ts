import { SMTPServer } from "@mailstream/smtp";

const options = {
  // key: fs.readFileSync(
  //   path.resolve(__dirname, "../../../local-assets/server-key.pem")
  // ),
  // cert: fs.readFileSync(
  //   path.resolve(__dirname, "../../../local-assets/server-cert.pem")
  // ),
  // ca: fs.readFileSync(
  //   path.resolve(__dirname, "../../../local-assets/server-csr.pem")
  // ),
  port: 8025,
};

new SMTPServer(console.log, options).listen(() => {
  console.log(`Listening on ${options.port}`);
});
