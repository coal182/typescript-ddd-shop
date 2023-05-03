import { EventBus } from '@shared/domain/event-bus';
import { CartUser } from '@storeback/cart/domain/cart-user';
import { Cart } from 'src/contexts/shop/cart/domain/cart';
import { CartEventStore } from 'src/contexts/shop/cart/domain/cart-event-store';
import { CartId } from 'src/contexts/shop/cart/domain/cart-id';

export class CartCreator {
  constructor(private eventBus: EventBus, private eventStore: CartEventStore) {}

  async run(params: { id: CartId; userId: CartUser }): Promise<void> {
    const cart = Cart.create(params.id, params.userId);

    const newDomainEvents = cart.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
