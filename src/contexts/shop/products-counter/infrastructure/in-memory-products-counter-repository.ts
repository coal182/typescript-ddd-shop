import { ProductsCounter } from '../domain/products-counter';
import { ProductsCounterId } from '../domain/products-counter-id';
import { ProductsCounterRepository } from '../domain/products-counter-repository';
import { ProductsCounterTotal } from '../domain/products-counter-total';

export class InMemoryProductsCounterRepository implements ProductsCounterRepository {
  private counter: ProductsCounter;
  constructor() {
    this.counter = new ProductsCounter(ProductsCounterId.random(), new ProductsCounterTotal(0), []);
  }

  async search(): Promise<ProductsCounter> {
    return this.counter;
  }

  async save(counter: ProductsCounter): Promise<void> {
    this.counter = counter;
  }
}
