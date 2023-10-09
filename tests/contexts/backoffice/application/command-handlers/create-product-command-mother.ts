import { CreateProductCommand } from '@backoffice-backend/product/application/commands/create-product';
import { ProductBrand } from '@shared/product/domain/product-brand';
import { ProductCategory } from '@shared/product/domain/product-category';
import { ProductDescription } from '@shared/product/domain/product-description';
import { ProductEan } from '@shared/product/domain/product-ean';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductImage } from '@shared/product/domain/product-image';
import { ProductName } from '@shared/product/domain/product-name';
import { ProductPrice } from '@shared/product/domain/product-price';
import { ProductBrandMother } from 'tests/contexts/shared/product/domain/product-brand-mother';
import { ProductCategoryMother } from 'tests/contexts/shared/product/domain/product-category-mother';
import { ProductDescriptionMother } from 'tests/contexts/shared/product/domain/product-description-mother';
import { ProductEanMother } from 'tests/contexts/shared/product/domain/product-ean-mother';
import { ProductIdMother } from 'tests/contexts/shared/product/domain/product-id-mother';
import { ProductImageMother } from 'tests/contexts/shared/product/domain/product-image-mother';
import { ProductNameMother } from 'tests/contexts/shared/product/domain/product-name-mother';
import { ProductPriceMother } from 'tests/contexts/shared/product/domain/product-price-mother';

export class CreateProductCommandMother {
  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    images: ProductImage[],
    price: ProductPrice,
    brand: ProductBrand,
    category: ProductCategory,
    ean: ProductEan
  ): CreateProductCommand {
    return {
      id: id.value,
      name: name.value,
      description: description.value,
      images: images.map((image) => image.value),
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
      [ProductImageMother.random(), ProductImageMother.random()],
      ProductPriceMother.random(),
      ProductBrandMother.random(),
      ProductCategoryMother.random(),
      ProductEanMother.random()
    );
  }

  static randomWithId(id: string): CreateProductCommand {
    return this.create(
      ProductIdMother.create(id),
      ProductNameMother.random(),
      ProductDescriptionMother.random(),
      [ProductImageMother.random(), ProductImageMother.random()],
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
      images: [ProductImageMother.random().value],
      price: ProductPriceMother.random().value,
      brand: ProductBrandMother.random().value,
      category: ProductCategoryMother.random().value,
      ean: ProductEanMother.random().value,
    };
  }
}
