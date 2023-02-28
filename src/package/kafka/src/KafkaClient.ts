interface KafkaClientConfig {
  indempotent: boolean;
  retries: number;
  debounce: {
    time?: number;
    messages?: number;
    size?: number;
  };
  timeout: number;
  transactionalId: string;
  verifySignatures: boolean;
  group: string;
  auth: {
    username: string;
    password: string;
    mechanism?:
      | "GSSAPI"
      | "PLAIN"
      | "SCRAM-SHA-256"
      | "SCRAM-SHA-512"
      | "OAUTHBEARER";
  };
  security: "plaintext" | "ssl" | "sasl_plaintext" | "sasl_ssl";
}

class KafkaClient {
  constructor(private brokers: string[]) {}
}
