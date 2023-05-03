import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { Cart } from '@storeback/cart/domain/cart';
import { CartEventStore } from '@storeback/cart/domain/cart-event-store';
import { CartId } from '@storeback/cart/domain/cart-id';
import { CartRepository } from '@storeback/cart/domain/cart-repository';
import { CartCleared } from 'src/contexts/shop/cart/domain/events/cart-cleared';

export class CartClearedEventHandler implements DomainEventSubscriber<CartCleared> {
  public event: string = CartCleared.name;

  constructor(private repository: CartRepository, private eventStore: CartEventStore) {}

  subscribedTo(): DomainEventClass[] {
    return [CartCleared];
  }

  async on(domainEvent: CartCleared): Promise<void> {
    const id = new CartId(domainEvent.aggregateId);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Cart not found by its id');
    }

    const cart = Cart.createEmptyCart(id);
    cart.loadFromHistory(events);
    await this.repository.save(cart);
  }
}
