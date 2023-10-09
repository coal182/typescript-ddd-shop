import { CreateProductCommand } from '@backoffice-backend/product/application/commands/create-product';
import { ProductBrand } from '@shared/product/domain/product-brand';
import { ProductCategory } from '@shared/product/domain/product-category';
import { ProductDescription } from '@shared/product/domain/product-description';
import { ProductEan } from '@shared/product/domain/product-ean';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductImage } from '@shared/product/domain/product-image';
import { ProductName } from '@shared/product/domain/product-name';
import { ProductPrice } from '@shared/product/domain/product-price';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductBrandMother } from 'tests/contexts/shared/product/domain/product-brand-mother';
import { ProductCategoryMother } from 'tests/contexts/shared/product/domain/product-category-mother';
import { ProductDescriptionMother } from 'tests/contexts/shared/product/domain/product-description-mother';
import { ProductEanMother } from 'tests/contexts/shared/product/domain/product-ean-mother';
import { ProductIdMother } from 'tests/contexts/shared/product/domain/product-id-mother';
import { ProductImageMother } from 'tests/contexts/shared/product/domain/product-image-mother';
import { ProductNameMother } from 'tests/contexts/shared/product/domain/product-name-mother';
import { ProductPriceMother } from 'tests/contexts/shared/product/domain/product-price-mother';

export class ProductMother {
  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    images: ProductImage[],
    price: ProductPrice,
    brand: ProductBrand,
    category: ProductCategory,
    ean: ProductEan,
    active: boolean,
    createdAt: Date
  ): Product {
    return new Product(id, name, description, images, price, brand, category, ean, active, createdAt);
  }

  static from(command: CreateProductCommand): Product {
    return this.create(
      ProductIdMother.create(command.id),
      ProductNameMother.create(command.name),
      ProductDescriptionMother.create(command.description),
      command.images.map((image) => ProductImageMother.create(image)),
      ProductPriceMother.create(command.price),
      ProductBrandMother.create(command.brand),
      ProductCategoryMother.create(command.category),
      ProductEanMother.create(command.ean),
      true,
      new Date()
    );
  }

  static random(): Product {
    return this.create(
      ProductIdMother.random(),
      ProductNameMother.random(),
      ProductDescriptionMother.random(),
      [ProductImageMother.random(), ProductImageMother.random()],
      ProductPriceMother.random(),
      ProductBrandMother.random(),
      ProductCategoryMother.random(),
      ProductEanMother.random(),
      true,
      new Date()
    );
  }
}
