import { ProductsResponse } from '@backoffice-backend/product/application/products-response';
import { Product } from '@backoffice-backend/product/domain/product';

export class SearchProductsByCriteriaResponseMother {
  static create(product: Array<Product>) {
    return new ProductsResponse(product);
  }
}
