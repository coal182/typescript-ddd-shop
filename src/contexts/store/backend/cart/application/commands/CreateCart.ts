import { Command } from '@core/Command';

export class CreateCartCommand extends Command {
  public userId: string;
  public static commandName = CreateCartCommand.name;

  constructor(userId: string, guid?: string) {
    super(guid);
    this.userId = userId;
  }
}
