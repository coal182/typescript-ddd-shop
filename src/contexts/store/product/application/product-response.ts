import { Product } from '../domain/product';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  version: number;
}

export class ProductsResponse {
  public readonly products: Array<ProductResponse>;

  constructor(products: Array<Product>) {
    this.products = products.map((product) => {
      const primitives = product.toPrimitives();
      return {
        id: primitives.id,
        name: primitives.name,
        description: primitives.description,
        image: primitives.image,
        price: primitives.price,
        version: 0,
      };
    });
  }
}
