import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { OrderEventStore } from '@storeback/order/domain/order-event-store';
import { OrderId } from '@storeback/order/domain/order-id';
import { OrderRepository } from '@storeback/order/domain/order-repository';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductRepository } from '@storeback/product/domain/product-repository';
import { OrderCreated } from 'src/contexts/shop/order/domain/events/order-created';
import { Order } from 'src/contexts/shop/order/domain/order';

export class OrderCreatedEventHandler implements DomainEventSubscriber<OrderCreated> {
  public event = OrderCreated.name;

  constructor(
    private repository: OrderRepository,
    private productRepository: ProductRepository,
    private eventStore: OrderEventStore
  ) {}

  subscribedTo(): DomainEventClass[] {
    return [OrderCreated];
  }

  async on(domainEvent: OrderCreated): Promise<void> {
    console.log('📌 ~ domainEvent:', domainEvent);
    const id = new OrderId(domainEvent.aggregateId);
    console.log('📌 ~ OrderId:', id);
    const events = await this.eventStore.findByAggregateId(id);
    console.log('📌 ~ events:', events);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }
    const order = Order.createEmptyOrder(id);
    order.loadFromHistory(events);
    console.log('📌 ~ order:', order);

    const lines = await Promise.all(
      order.lines.map(async (line) => {
        const product = await this.productRepository.search(new ProductId(line.productId));
        return { ...line, product: product?.toPrimitives() };
      })
    );

    order.lines = lines;

    await this.repository.save(order);
  }
}
