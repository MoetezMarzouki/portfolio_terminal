// Command system types
export interface ParsedCommand {
  name: string;
  args: string[];
  rawInput: string;
}

export interface CommandResult {
  success: boolean;
  output: string[];
  error?: string;
}

export type CommandHandler = (args: string[]) => CommandResult;

export interface Command {
  name: string;
  description: string;
  usage: string;
  handler: CommandHandler;
}
