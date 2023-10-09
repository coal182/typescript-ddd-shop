import { ProductsResponse } from '@backoffice-backend/product/application/products-response';
import { Product } from '@backoffice-backend/product/domain/product';

export class SearchAllProductsResponseMother {
  static create(products: Array<Product>) {
    return new ProductsResponse(products);
  }
}
