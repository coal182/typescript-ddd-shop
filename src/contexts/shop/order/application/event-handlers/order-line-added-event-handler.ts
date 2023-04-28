import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { OrderLineAdded } from 'src/contexts/shop/order/domain/events/order-line-added';

export class OrderLineAddedEventHandler implements DomainEventSubscriber<OrderLineAdded> {
  public event = OrderLineAdded.name;

  subscribedTo(): DomainEventClass[] {
    return [OrderLineAdded];
  }

  async on(domainEvent: OrderLineAdded): Promise<void> {
    // no need to do anything here we'll handle the created event
  }
}
