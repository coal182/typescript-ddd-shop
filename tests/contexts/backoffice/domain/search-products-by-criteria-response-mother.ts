import { BackofficeProductsResponse } from '@backoffice-backend/product/application/backoffice-products-response';
import { BackofficeProduct } from '@backoffice-backend/product/domain/backoffice-product';

export class SearchProductsByCriteriaResponseMother {
  static create(product: Array<BackofficeProduct>) {
    return new BackofficeProductsResponse(product);
  }
}
