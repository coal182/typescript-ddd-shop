import { ProductRepository } from '../../domain/ProductRepository';

export class ProductsFinder {
  constructor(private productRepository: ProductRepository) {}

  async run() {
    const products = await this.productRepository.searchAll();

    return products;
  }
}
