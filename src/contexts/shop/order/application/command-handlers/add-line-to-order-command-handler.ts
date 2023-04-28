import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { OrderEventStore } from '@storeback/order/domain/order-event-store';
import { OrderId } from '@storeback/order/domain/order-id';
import { AddLineToOrderCommand } from 'src/contexts/shop/order/application/commands/add-line-to-order';
import { Order } from 'src/contexts/shop/order/domain/order';
import { OrderLine } from 'src/contexts/shop/order/domain/order-line';

export class AddLineToOrderCommandHandler implements CommandHandler<AddLineToOrderCommand> {
  constructor(private eventBus: EventBus, private readonly eventStore: OrderEventStore) {}

  subscribedTo(): Command {
    return AddLineToOrderCommand;
  }

  async handle(command: AddLineToOrderCommand) {
    const id = new OrderId(command.id);
    const line = new OrderLine(command.productId, command.qty, command.price);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Order not found by its id');
    }

    const order = Order.createEmptyOrder(id);
    order.loadFromHistory(events);
    order.addLine(line);
    const newDomainEvents = order.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
