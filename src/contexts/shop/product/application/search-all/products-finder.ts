import { ProductRepository } from '../../domain/product-repository';

export class ProductsFinder {
  constructor(private productRepository: ProductRepository) {}

  async run() {
    const products = await this.productRepository.searchAll();

    return products;
  }
}
