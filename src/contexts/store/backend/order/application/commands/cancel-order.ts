import { Command } from '@core/command';
import { OrderStatus } from '@storeback/order/domain/order';

export class CancelOrderCommand extends Command {
  public status: OrderStatus;

  public static commandName = CancelOrderCommand.name;

  constructor(guid: string, status: OrderStatus, public readonly originalVersion: number) {
    super(guid);
    this.status = status;
    this.originalVersion = originalVersion;
  }
}
