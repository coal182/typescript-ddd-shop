import { Command } from '@core/command';

export class CancelOrderCommand extends Command {
  public static commandName = CancelOrderCommand.name;

  constructor(guid: string, readonly status: string, readonly originalVersion: number) {
    super(guid);
    this.status = status;
    this.originalVersion = originalVersion;
  }
}
