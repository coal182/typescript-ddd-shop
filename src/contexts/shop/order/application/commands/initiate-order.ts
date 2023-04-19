import { Command } from '@core/command';

export class InitiateOrderCommand extends Command {
  public guid: string;
  public userId: string;
  public name: string;
  public address: string;
  public total: number;
  public static commandName = InitiateOrderCommand.name;

  constructor(guid: string, userId: string, name: string, address: string, total: number) {
    super(guid);
    this.userId = userId;
    this.name = name;
    this.address = address;
    this.total = total;
  }
}
