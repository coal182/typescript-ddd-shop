import { BackofficeProductRepository } from '../../domain/backoffice-product-repository';

export class ProductsFinder {
  constructor(private productsRepository: BackofficeProductRepository) {}

  async run() {
    const products = await this.productsRepository.searchAll();

    return products;
  }
}
