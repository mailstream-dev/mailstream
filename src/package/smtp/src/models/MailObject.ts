interface MailObject {
  recipients: string[];
  from: string;
  body: string;
}

const merge = (prev: MailObject, next: Partial<MailObject>): MailObject => {
  const recipients = Array.isArray(next.recipients)
    ? [...prev.recipients, ...next.recipients]
    : prev.recipients;
  return { ...prev, ...next, recipients };
};

export { merge };
export default MailObject;
