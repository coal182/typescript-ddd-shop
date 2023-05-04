import { CreateProductCommand } from '@storeback/product/application/commands/create-product';
import { ProductDescription } from '@storeback/product/domain/product-description';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductImage } from '@storeback/product/domain/product-image';
import { ProductName } from '@storeback/product/domain/product-name';
import { ProductPrice } from '@storeback/product/domain/product-price';

import { ProductDescriptionMother } from '../../domain/product-description-mother';
import { ProductIdMother } from '../../domain/product-id-mother';
import { ProductImageMother } from '../../domain/product-image-mother';
import { ProductNameMother } from '../../domain/product-name-mother';
import { ProductPriceMother } from '../../domain/product-price-mother';

export class CreateProductCommandMother {
  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    image: ProductImage,
    price: ProductPrice
  ): CreateProductCommand {
    return { id: id.value, name: name.value, description: description.value, image: image.value, price: price.value };
  }

  static random(): CreateProductCommand {
    return this.create(
      ProductIdMother.random(),
      ProductNameMother.random(),
      ProductDescriptionMother.random(),
      ProductImageMother.random(),
      ProductPriceMother.random()
    );
  }

  static invalid(): CreateProductCommand {
    return {
      id: ProductIdMother.random().value,
      name: ProductNameMother.invalidName(),
      description: ProductDescriptionMother.random().value,
      image: ProductImageMother.random().value,
      price: ProductPriceMother.random().value,
    };
  }
}
