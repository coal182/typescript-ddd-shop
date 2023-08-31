import { CreateProductCommand } from '@shop-backend/product/application/commands/create-product';
import { ProductBrand } from '@shop-backend/product/domain/product-brand';
import { ProductCategory } from '@shop-backend/product/domain/product-category';
import { ProductEan } from '@shop-backend/product/domain/product-ean';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { ProductPrice } from 'src/contexts/shop/product/domain/product-price';

import { ProductBrandMother } from './product-brand-mother';
import { ProductCategoryMother } from './product-category-mother';
import { ProductDescriptionMother } from './product-description-mother';
import { ProductEanMother } from './product-ean-mother';
import { ProductIdMother } from './product-id-mother';
import { ProductImageMother } from './product-image-mother';
import { ProductNameMother } from './product-name-mother';
import { ProductPriceMother } from './product-price-mother';

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
