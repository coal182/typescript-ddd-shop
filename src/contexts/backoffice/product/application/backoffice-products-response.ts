import { BackofficeProduct } from '../domain/backoffice-product';

export interface BackofficeProductResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  brand: string;
  category: string;
  ean: string;
}

export class BackofficeProductsResponse {
  public readonly products: Array<BackofficeProductResponse>;

  constructor(products: Array<BackofficeProduct>) {
    this.products = products.map((product) => {
      const primitives = product.toPrimitives();
      return {
        id: primitives.id,
        name: primitives.name,
        description: primitives.description,
        image: primitives.image,
        price: primitives.price,
        brand: primitives.brand,
        category: primitives.category,
        ean: primitives.ean,
      };
    });
  }
}
