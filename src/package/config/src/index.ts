import config from "config";

interface SMTPDomainConfig {
  port: number;
  ip: string;
}

interface SSLDomainConfig {
  bucket: string;
}

interface Config {
  smtp: SMTPDomainConfig;
  ssl: SSLDomainConfig;
}

class ConfigFile implements Config {
  get smtp(): SMTPDomainConfig {
    return config.get("smtp");
  }

  get ssl(): SSLDomainConfig {
    return config.get("ssl");
  }
}

export default new ConfigFile() as Config;
