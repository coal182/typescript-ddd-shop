import { BackofficeProduct } from '../domain/backoffice-product';

export class BackofficeProductResponse {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly images: string[];
  public readonly price: number;
  public readonly brand: string;
  public readonly category: string;
  public readonly ean: string;

  constructor(product: BackofficeProduct) {
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
  }
}

export class BackofficeProductsResponse {
  public readonly products: Array<BackofficeProductResponse>;

  constructor(products: Array<BackofficeProduct>) {
    this.products = products.map((product) => new BackofficeProductResponse(product));
  }
}
