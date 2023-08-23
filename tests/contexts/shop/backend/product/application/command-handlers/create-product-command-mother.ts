import { CreateProductCommand } from '@shop-backend/product/application/commands/create-product';
import { ProductBrand } from '@shop-backend/product/domain/product-brand';
import { ProductCategory } from '@shop-backend/product/domain/product-category';
import { ProductDescription } from '@shop-backend/product/domain/product-description';
import { ProductEan } from '@shop-backend/product/domain/product-ean';
import { ProductId } from '@shop-backend/product/domain/product-id';
import { ProductImage } from '@shop-backend/product/domain/product-image';
import { ProductName } from '@shop-backend/product/domain/product-name';
import { ProductPrice } from '@shop-backend/product/domain/product-price';

import { ProductBrandMother } from '../../domain/product-brand-mother';
import { ProductCategoryMother } from '../../domain/product-category-mother';
import { ProductDescriptionMother } from '../../domain/product-description-mother';
import { ProductEanMother } from '../../domain/product-ean-mother';
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
    price: ProductPrice,
    brand: ProductBrand,
    category: ProductCategory,
    ean: ProductEan
  ): CreateProductCommand {
    return {
      id: id.value,
      name: name.value,
      description: description.value,
      image: image.value,
      price: price.value,
      brand: brand.value,
      category: category.value,
      ean: ean.value,
    };
  }

  static random(): CreateProductCommand {
    return this.create(
      ProductIdMother.random(),
      ProductNameMother.random(),
      ProductDescriptionMother.random(),
      ProductImageMother.random(),
      ProductPriceMother.random(),
      ProductBrandMother.random(),
      ProductCategoryMother.random(),
      ProductEanMother.random()
    );
  }

  static invalid(): CreateProductCommand {
    return {
      id: ProductIdMother.random().value,
      name: ProductNameMother.invalidName(),
      description: ProductDescriptionMother.random().value,
      image: ProductImageMother.random().value,
      price: ProductPriceMother.random().value,
      brand: ProductBrandMother.random().value,
      category: ProductCategoryMother.random().value,
      ean: ProductEanMother.random().value,
    };
  }
}
