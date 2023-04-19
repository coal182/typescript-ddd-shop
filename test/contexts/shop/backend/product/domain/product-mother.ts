import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { ProductPrice } from 'src/contexts/shop/product/domain/product-price';

import { ProductDescriptionMother } from './product-description-mother';
import { ProductIdMother } from './product-id-mother';
import { ProductImageMother } from './product-image-mother';
import { ProductNameMother } from './product-name-mother';
import { ProductPriceMother } from './product-price-mother';

export class ProductMother {
  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    image: ProductImage,
    price: ProductPrice
  ): Product {
    return new Product(id, name, description, image, price);
  }

  static random(): Product {
    return this.create(
      ProductIdMother.random(),
      ProductNameMother.random(),
      ProductDescriptionMother.random(),
      ProductImageMother.random(),
      ProductPriceMother.random()
    );
  }
}
