import { Given } from '@cucumber/cucumber';

import { Product } from '@storeback/product/domain/product';
import { ProductBrand } from '@storeback/product/domain/product-brand';
import { ProductCategory } from '@storeback/product/domain/product-category';
import { ProductDescription } from '@storeback/product/domain/product-description';
import { ProductEan } from '@storeback/product/domain/product-ean';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductImage } from '@storeback/product/domain/product-image';
import { ProductName } from '@storeback/product/domain/product-name';
import { ProductPrice } from '@storeback/product/domain/product-price';
import { ProductRepository } from '@storeback/product/domain/product-repository';
import { containerFactory } from '@storebackapp/dependency-injection';

containerFactory().then((container) => {
  const productRepository: ProductRepository = container.get('Shop.Products.domain.ProductRepository');

  Given('there is the product:', async (product: any) => {
    const { id, name, description, image, price, brand, category, ean } = JSON.parse(product);

    await productRepository.save(
      new Product(
        new ProductId(id),
        new ProductName(name),
        new ProductDescription(description),
        new ProductImage(image),
        new ProductPrice(price),
        new ProductBrand(brand),
        new ProductCategory(category),
        new ProductEan(ean)
      )
    );
  });
});
