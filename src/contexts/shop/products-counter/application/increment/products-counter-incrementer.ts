import { EventBus } from '@shared/domain/event-bus';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductsCounter } from '@storeback/products-counter/domain/products-counter';
import { ProductsCounterId } from '@storeback/products-counter/domain/products-counter-id';
import { ProductsCounterRepository } from '@storeback/products-counter/domain/products-counter-repository';

export class ProductsCounterIncrementer {
  constructor(private repository: ProductsCounterRepository, private bus: EventBus) {}

  async run(productId: ProductId) {
    const counter = (await this.repository.search()) || this.initializeCounter();

    if (!counter.hasIncremented(productId)) {
      counter.increment(productId);

      await this.repository.save(counter);
      await this.bus.publish(counter.pullDomainEvents());
    }
  }

  private initializeCounter(): ProductsCounter {
    return ProductsCounter.initialize(ProductsCounterId.random());
  }
}
