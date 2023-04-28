import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { OrderEventStore } from '@storeback/order/domain/order-event-store';
import { OrderId } from '@storeback/order/domain/order-id';
import { Order } from 'src/contexts/shop/order/domain/order';

import { CreateOrderCommand } from '../commands/create-order';

export class CreateOrderCommandHandler implements CommandHandler<CreateOrderCommand> {
  constructor(private eventBus: EventBus, private readonly eventStore: OrderEventStore) {}

  subscribedTo(): Command {
    return CreateOrderCommand;
  }

  async handle(command: CreateOrderCommand) {
    console.log('📌 ~ command:', command);
    const id = new OrderId(command.id);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Order not found by its id');
    }

    const order = Order.createEmptyOrder(id);
    order.loadFromHistory(events);
    order.create();
    const newDomainEvents = order.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
