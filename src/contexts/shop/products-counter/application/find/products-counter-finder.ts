import { ProductsCounterNotExist } from '@storeback/products-counter/domain/products-counter-not-exist';
import { ProductsCounterRepository } from '@storeback/products-counter/domain/products-counter-repository';

export class ProductsCounterFinder {
  constructor(private repository: ProductsCounterRepository) {}

  async run() {
    const counter = await this.repository.search();
    if (!counter) {
      throw new ProductsCounterNotExist();
    }

    return counter.total.value;
  }
}
