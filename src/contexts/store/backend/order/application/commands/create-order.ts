import { Command } from '@core/command';
import { OrderStatus } from '@storeback/order/domain/order';

export class CreateOrderCommand extends Command {
  public userId: string;
  public status: OrderStatus;
  public name: string;
  public address: string;
  public total: number;
  public static commandName = CreateOrderCommand.name;

  constructor(userId: string, guid: string, status: OrderStatus, name: string, address: string, total: number) {
    super(guid);
    this.userId = userId;
    this.status = status;
    this.name = name;
    this.address = address;
    this.total = total;
  }
}
