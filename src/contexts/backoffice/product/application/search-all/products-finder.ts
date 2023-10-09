import { ProductRepository } from '../../domain/product-repository';

export class ProductsFinder {
  constructor(private productsRepository: ProductRepository) {}

  async run() {
    const products = await this.productsRepository.searchAll();

    return products;
  }
}
