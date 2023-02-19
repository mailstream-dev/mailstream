import SMTPCommand from "./SMTPCommand";

import * as BasicCommands from "../commands";

class CommandRepository {
  private repo: Map<string, SMTPCommand>;

  constructor(basicCommands: SMTPCommand[]) {
    this.repo = new Map(basicCommands.map((c) => [c.name, c]));
  }

  register(command: SMTPCommand) {
    if (this.repo.has(command.name)) {
      throw new Error("Unable to register duplicate command");
    }

    this.repo.set(command.name, command);
  }

  keys(): string[] {
    return [...this.repo.keys()];
  }

  get(key: string): SMTPCommand | undefined {
    return this.repo.get(key);
  }
}

export default new CommandRepository(Object.values(BasicCommands));
