import {Product} from '../domain/product';

export class ProductResponse {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly images: string[];
    public readonly price: number;
    public readonly brand: string;
    public readonly category: string;
    public readonly ean: string;

    constructor(product: Product) {
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

export class ProductsResponse {
    public readonly products: ReadonlyArray<ProductResponse>;

    constructor(products: ReadonlyArray<Product>) {
        this.products = products.map((product) => new ProductResponse(product));
    }
}
