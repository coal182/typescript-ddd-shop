import { BackofficeProductBrand } from '@backoffice-backend/product/domain/backoffice-product-brand';
import { BackofficeProductCategory } from '@backoffice-backend/product/domain/backoffice-product-category';
import { BackofficeProductEan } from '@backoffice-backend/product/domain/backoffice-product-ean';
import { CreateProductCommand } from '@shop-backend/product/application/commands/create-product';
import { BackofficeProduct } from 'src/contexts/backoffice/product/domain/backoffice-product';
import { BackofficeProductDescription } from 'src/contexts/backoffice/product/domain/backoffice-product-description';
import { BackofficeProductId } from 'src/contexts/backoffice/product/domain/backoffice-product-id';
import { BackofficeProductImage } from 'src/contexts/backoffice/product/domain/backoffice-product-image';
import { BackofficeProductName } from 'src/contexts/backoffice/product/domain/backoffice-product-name';
import { BackofficeProductPrice } from 'src/contexts/backoffice/product/domain/backoffice-product-price';

import { BackofficeProductBrandMother } from './backoffice-product-brand-mother';
import { BackofficeProductCategoryMother } from './backoffice-product-category-mother';
import { BackofficeProductDescriptionMother } from './backoffice-product-description-mother';
import { BackofficeProductEanMother } from './backoffice-product-ean-mother';
import { BackofficeProductIdMother } from './backoffice-product-id-mother';
import { BackofficeProductImageMother } from './backoffice-product-image-mother';
import { BackofficeProductNameMother } from './backoffice-product-name-mother';
import { BackofficeProductPriceMother } from './backoffice-product-price-mother';

export class BackofficeProductMother {
  static create(
    id: BackofficeProductId,
    name: BackofficeProductName,
    description: BackofficeProductDescription,
    images: BackofficeProductImage[],
    price: BackofficeProductPrice,
    brand: BackofficeProductBrand,
    category: BackofficeProductCategory,
    ean: BackofficeProductEan,
    active: boolean,
    createdAt: Date
  ): BackofficeProduct {
    return new BackofficeProduct(id, name, description, images, price, brand, category, ean, active, createdAt);
  }

  static from(command: CreateProductCommand): BackofficeProduct {
    return this.create(
      BackofficeProductIdMother.create(command.id),
      BackofficeProductNameMother.create(command.name),
      BackofficeProductDescriptionMother.create(command.description),
      command.images.map((image) => BackofficeProductImageMother.create(image)),
      BackofficeProductPriceMother.create(command.price),
      BackofficeProductBrandMother.create(command.brand),
      BackofficeProductCategoryMother.create(command.category),
      BackofficeProductEanMother.create(command.ean),
      true,
      new Date()
    );
  }

  static random(): BackofficeProduct {
    return this.create(
      BackofficeProductIdMother.random(),
      BackofficeProductNameMother.random(),
      BackofficeProductDescriptionMother.random(),
      [BackofficeProductImageMother.random(), BackofficeProductImageMother.random()],
      BackofficeProductPriceMother.random(),
      BackofficeProductBrandMother.random(),
      BackofficeProductCategoryMother.random(),
      BackofficeProductEanMother.random(),
      true,
      new Date()
    );
  }
}
