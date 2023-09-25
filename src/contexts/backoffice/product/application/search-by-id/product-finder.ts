import { BackofficeProduct } from '@backoffice-backend/product/domain/backoffice-product';
import { BackofficeProductId } from '@backoffice-backend/product/domain/backoffice-product-id';
import { ProductNotFound } from '@shop-backend/product/domain/product-not-found';

import { BackofficeProductRepository } from '../../domain/backoffice-product-repository';

export class ProductFinder {
  constructor(private productRepository: BackofficeProductRepository) {}

  async run(id: BackofficeProductId): Promise<BackofficeProduct> {
    const product = await this.productRepository.search(id);

    if (!product) {
      throw new ProductNotFound(id.toString());
    }

    return product;
  }
}
