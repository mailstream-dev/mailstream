import { SMTPServer } from "@mailstream/smtp";

new SMTPServer().listen(() => {
  console.log("Listening");
});
