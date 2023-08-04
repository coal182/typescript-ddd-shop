import { Command } from '@shared/domain/command';

export class UnhandledCommand extends Command {
  static COMMAND_NAME = 'unhandled.command';
}
