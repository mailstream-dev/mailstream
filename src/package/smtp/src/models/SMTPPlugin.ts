import Request from "./Request";
import Response from "./Response";
import SMTPCommand, { CommandResult } from "./SMTPCommand";

type CommandCallee = (req: Request, res: Response) => CommandResult;
interface PluginCommandItem {
  name: string;
  terminator?: string;
  action: CommandCallee;
}

class SMTPPlugin {
  public commands: Array<SMTPCommand> = [];

  constructor(
    public name: string,
    ...cmds: Array<PluginCommandItem | SMTPCommand>
  ) {
    if (cmds.length === 0) {
      throw new Error("Plugins must provide at least one command");
    }

    for (const cmd of cmds) {
      if (cmd instanceof SMTPCommand) {
        this.commands.push(cmd);
      } else {
        const p = cmd as PluginCommandItem;
        const PluginCommand = class extends SMTPCommand {
          constructor() {
            if (p.terminator) {
              super(p.name, p.terminator);
            } else {
              super(p.name);
            }
          }

          command(req: Request, res: Response): CommandResult {
            return p.action(req, res);
          }
        };

        this.commands.push(new PluginCommand());
      }
    }
  }
}

export default SMTPPlugin;
