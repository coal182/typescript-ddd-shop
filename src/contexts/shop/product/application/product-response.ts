import { Product } from '../domain/product';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  brand: string;
  category: string;
  ean: string;
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
        images: primitives.images,
        price: primitives.price,
        brand: primitives.brand,
        category: primitives.category,
        ean: primitives.ean,
      };
    });
  }
}
