import { Given } from '@cucumber/cucumber';

import { Product } from '@backoffice-backend/product/domain/product';
import { ProductRepository } from '@backoffice-backend/product/domain/product-repository';
import { ProductBrand } from '@shared/product/domain/product-brand';
import { ProductCategory } from '@shared/product/domain/product-category';
import { ProductDescription } from '@shared/product/domain/product-description';
import { ProductEan } from '@shared/product/domain/product-ean';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductImage } from '@shared/product/domain/product-image';
import { ProductName } from '@shared/product/domain/product-name';
import { ProductPrice } from '@shared/product/domain/product-price';

import { application } from './hooks.steps';

Given('there is the product:', async (product: any) => {
  const productRepository: ProductRepository = application.container.get(
    'Backoffice.Products.domain.ProductRepository'
  );
  const { id, name, description, images, price, brand, category, ean } = JSON.parse(product);

  await productRepository.save(
    new Product(
      new ProductId(id),
      new ProductName(name),
      new ProductDescription(description),
      (images as string[]).map((image) => new ProductImage(image)),
      new ProductPrice(price),
      new ProductBrand(brand),
      new ProductCategory(category),
      new ProductEan(ean),
      true,
      new Date()
    )
  );
});
