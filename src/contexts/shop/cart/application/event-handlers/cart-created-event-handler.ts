import {DomainEventClass} from '@shared/domain/domain-event';
import {DomainEventSubscriber} from '@shared/domain/domain-event-subscriber';
import {Cart} from '@shop-backend/cart/domain/cart';
import {CartId} from '@shop-backend/cart/domain/cart-id';
import {CartRepository} from '@shop-backend/cart/domain/cart-repository';
import {CartUser} from '@shop-backend/cart/domain/cart-user';
import {CartCreated} from 'src/contexts/shop/cart/domain/events/cart-created';

export class CartCreatedEventHandler implements DomainEventSubscriber<CartCreated> {
    public event: string = CartCreated.name;

    constructor(private repository: CartRepository) {}

    subscribedTo(): DomainEventClass[] {
        return [CartCreated];
    }

    async on(domainEvent: CartCreated): Promise<void> {
        const id = new CartId(domainEvent.aggregateId);
        const userId = new CartUser(domainEvent.userId);

        const cart = new Cart(id, userId);
        await this.repository.save(cart);
    }
}
