import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { OrderInitiated } from 'src/contexts/shop/order/domain/events/order-initiated';

export class OrderInitiatedEventHandler implements DomainEventSubscriber<OrderInitiated> {
  public event: string = OrderInitiated.name;

  subscribedTo(): DomainEventClass[] {
    return [OrderInitiated];
  }

  async on(domainEvent: OrderInitiated): Promise<void> {
    // no need to do anything here we'll handle the created event
  }
}
