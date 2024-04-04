import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { OrderEventStore } from '@shop-backend/order/domain/order-event-store';
import { OrderId } from '@shop-backend/order/domain/order-id';
import { OrderRepository } from '@shop-backend/order/domain/order-repository';
import { OrderCancelled } from 'src/contexts/shop/order/domain/events/order-cancelled';
import { Order } from 'src/contexts/shop/order/domain/order';

export class OrderCancelledEventHandler implements DomainEventSubscriber<OrderCancelled> {
  public event = OrderCancelled.name;

  constructor(private repository: OrderRepository, private eventStore: OrderEventStore) {}

  subscribedTo(): DomainEventClass[] {
    return [OrderCancelled];
  }

  async on(domainEvent: OrderCancelled): Promise<void> {
    const id = new OrderId(domainEvent.aggregateId);
    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Order not found by its id');
    }
    const order = Order.initialize(id);
    order.loadFromHistory(events);

    await this.repository.save(order);
  }
}
