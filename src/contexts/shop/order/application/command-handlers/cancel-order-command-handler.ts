import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { OrderEventStore } from '@shop-backend/order/domain/order-event-store';
import { OrderId } from '@shop-backend/order/domain/order-id';
import { Order } from 'src/contexts/shop/order/domain/order';

import { CancelOrderCommand } from '../commands/cancel-order';

export class CancelOrderCommandHandler implements CommandHandler<CancelOrderCommand> {
  constructor(private eventBus: EventBus, private readonly eventStore: OrderEventStore) {}

  subscribedTo(): Command {
    return CancelOrderCommand;
  }

  async handle(command: CancelOrderCommand) {
    const id = new OrderId(command.id);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Order not found by its id');
    }

    const order = Order.initialize(id);
    order.loadFromHistory(events);
    order.cancel();
    const newDomainEvents = order.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
