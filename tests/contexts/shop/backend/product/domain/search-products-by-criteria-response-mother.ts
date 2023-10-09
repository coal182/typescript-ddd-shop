import { ProductsResponse } from '@shop-backend/product/application/product-response';
import { Product } from '@shop-backend/product/domain/product';

export class SearchProductsByCriteriaResponseMother {
  static create(product: Array<Product>) {
    return new ProductsResponse(product);
  }
}
