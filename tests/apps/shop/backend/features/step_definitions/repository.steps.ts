import { Given } from '@cucumber/cucumber';

import { Product } from '@shop-backend/product/domain/product';
import { ProductBrand } from '@shop-backend/product/domain/product-brand';
import { ProductCategory } from '@shop-backend/product/domain/product-category';
import { ProductDescription } from '@shop-backend/product/domain/product-description';
import { ProductEan } from '@shop-backend/product/domain/product-ean';
import { ProductId } from '@shop-backend/product/domain/product-id';
import { ProductImage } from '@shop-backend/product/domain/product-image';
import { ProductName } from '@shop-backend/product/domain/product-name';
import { ProductPrice } from '@shop-backend/product/domain/product-price';
import { ProductRepository } from '@shop-backend/product/domain/product-repository';
import { containerFactory } from '@shop-backend-app/dependency-injection';

containerFactory().then((container) => {
  const productRepository: ProductRepository = container.get('Shop.Products.domain.ProductRepository');

  Given('there is the product:', async (product: any) => {
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
});
