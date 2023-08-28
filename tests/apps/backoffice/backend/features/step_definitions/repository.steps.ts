import { Given } from '@cucumber/cucumber';

import { BackofficeProduct } from '@backoffice-backend/product/domain/backoffice-product';
import { BackofficeProductBrand } from '@backoffice-backend/product/domain/backoffice-product-brand';
import { BackofficeProductCategory } from '@backoffice-backend/product/domain/backoffice-product-category';
import { BackofficeProductDescription } from '@backoffice-backend/product/domain/backoffice-product-description';
import { BackofficeProductEan } from '@backoffice-backend/product/domain/backoffice-product-ean';
import { BackofficeProductId } from '@backoffice-backend/product/domain/backoffice-product-id';
import { BackofficeProductImage } from '@backoffice-backend/product/domain/backoffice-product-image';
import { BackofficeProductName } from '@backoffice-backend/product/domain/backoffice-product-name';
import { BackofficeProductPrice } from '@backoffice-backend/product/domain/backoffice-product-price';
import { BackofficeProductRepository } from '@backoffice-backend/product/domain/backoffice-product-repository';

import { application } from './hooks.steps';

Given('there is the product:', async (product: any) => {
  const productRepository: BackofficeProductRepository = application.container.get(
    'Backoffice.Products.domain.BackofficeProductRepository'
  );
  const { id, name, description, image, price, brand, category, ean } = JSON.parse(product);

  await productRepository.save(
    new BackofficeProduct(
      new BackofficeProductId(id),
      new BackofficeProductName(name),
      new BackofficeProductDescription(description),
      new BackofficeProductImage(image),
      new BackofficeProductPrice(price),
      new BackofficeProductBrand(brand),
      new BackofficeProductCategory(category),
      new BackofficeProductEan(ean)
    )
  );
});
