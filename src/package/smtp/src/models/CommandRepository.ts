import SMTPCommand from "./SMTPCommand";
import SMTPPlugin from "./SMTPPlugin";

import * as BasicCommands from "../commands";

class CommandRepository {
  private repo: Map<string, SMTPCommand>;
  public plugins: string[] = [];

  constructor(basicCommands: SMTPCommand[]) {
    this.repo = new Map(basicCommands.map((c) => [c.name, c]));
  }

  register(plugin: SMTPPlugin) {
    this.plugins.push(plugin.name);
    for (const command of plugin.commands) {
      this.repo.set(command.name, command);
    }
  }

  keys(): string[] {
    return [...this.repo.keys()];
  }

  get(key: string): SMTPCommand | undefined {
    return this.repo.get(key);
  }
}

export default new CommandRepository(Object.values(BasicCommands));
