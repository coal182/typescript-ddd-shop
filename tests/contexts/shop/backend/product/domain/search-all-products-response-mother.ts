import { ProductsResponse } from '@shop-backend/product/application/product-response';
import { Product } from '@shop-backend/product/domain/product';

export class SearchAllProductsResponseMother {
  static create(products: Array<Product>) {
    return new ProductsResponse(products);
  }
}
