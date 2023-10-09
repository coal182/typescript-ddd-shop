import { ProductId } from '@shared/product/domain/product-id';
import { Product } from '@shop-backend/product/domain/product';
import { ProductNotFound } from '@shop-backend/product/domain/product-not-found';

import { ProductRepository } from '../../domain/product-repository';

export class ProductFinder {
  constructor(private productRepository: ProductRepository) {}

  async run(id: ProductId): Promise<Product> {
    const product = await this.productRepository.search(id);

    if (!product) {
      throw new ProductNotFound(id.toString());
    }

    return product;
  }
}
