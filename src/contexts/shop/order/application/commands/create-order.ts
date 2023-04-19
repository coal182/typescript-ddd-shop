import { Command } from '@core/command';

export class CreateOrderCommand extends Command {
  public guid: string;
  public status: string;
  public originalVersion: number;
  public static commandName = CreateOrderCommand.name;

  constructor(guid: string, status: string, originalVersion: number) {
    super(guid);
    this.status = status;
    this.originalVersion = originalVersion;
  }
}
