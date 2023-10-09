import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { Cart } from '@shop-backend/cart/domain/cart';
import { CartEventStore } from '@shop-backend/cart/domain/cart-event-store';
import { CartId } from '@shop-backend/cart/domain/cart-id';
import { CartRepository } from '@shop-backend/cart/domain/cart-repository';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductRepository } from '@shop-backend/product/domain/product-repository';
import { CartItemAdded } from 'src/contexts/shop/cart/domain/events/cart-item-added';

export class CartItemAddedEventHandler implements DomainEventSubscriber<CartItemAdded> {
  public event: string = CartItemAdded.name;

  constructor(
    private repository: CartRepository,
    private productRepository: ProductRepository,
    private eventStore: CartEventStore
  ) {}

  subscribedTo(): DomainEventClass[] {
    return [CartItemAdded];
  }

  async on(domainEvent: CartItemAdded): Promise<void> {
    const id = new CartId(domainEvent.aggregateId);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Cart not found by its id');
    }

    const cart = Cart.createEmptyCart(id);
    cart.loadFromHistory(events);

    const items = await Promise.all(
      cart.getItems().map(async (item) => {
        const product = await this.productRepository.search(new ProductId(item.productId));
        return { ...item, product: product?.toPrimitives() };
      })
    );

    cart.setItems(items);

    await this.repository.save(cart);
  }
}
