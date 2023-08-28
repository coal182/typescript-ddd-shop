import { BackofficeProductsResponse } from '@backoffice-backend/product/application/backoffice-products-response';
import { BackofficeProduct } from '@backoffice-backend/product/domain/backoffice-product';

export class SearchAllProductsResponseMother {
  static create(products: Array<BackofficeProduct>) {
    return new BackofficeProductsResponse(products);
  }
}
