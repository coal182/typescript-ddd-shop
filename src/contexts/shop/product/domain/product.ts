/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Primitives } from '@domain/value-objects/primitives-type';
import { AggregateRoot } from '@shared/domain/aggregate-root';
import { DomainEvent } from '@shared/domain/domain-event';

import { ProductCreated } from './events/product-created';
import { ProductDescriptionChanged } from './events/product-description-changed';
import { ProductImageChanged } from './events/product-image-changed';
import { ProductBrand } from './product-brand';
import { ProductCategory } from './product-category';
import { ProductDescription } from './product-description';
import { ProductEan } from './product-ean';
import { ProductId } from './product-id';
import { ProductImage } from './product-image';
import { ProductName } from './product-name';
import { ProductPrice } from './product-price';
export class Product extends AggregateRoot {
  public id: ProductId;
  public name: ProductName;
  public description: ProductDescription;
  public image: ProductImage;
  public price: ProductPrice;
  public brand: ProductBrand;
  public category: ProductCategory;
  public ean: ProductEan;

  constructor(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    image: ProductImage,
    price: ProductPrice,
    brand: ProductBrand,
    category: ProductCategory,
    ean: ProductEan
  ) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.ean = ean;
  }

  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    image: ProductImage,
    price: ProductPrice,
    brand: ProductBrand,
    category: ProductCategory,
    ean: ProductEan
  ): Product {
    const product = new Product(id, name, description, image, price, brand, category, ean);

    product.record(
      new ProductCreated({
        aggregateId: product.id.value,
        name: product.name.value,
        description: product.description.value,
        image: product.image.value,
        price: product.price.value,
        brand: product.brand.value,
        category: product.category.value,
        ean: product.ean.value,
      })
    );

    return product;
  }

  static createEmptyProduct(id: ProductId): Product {
    const name = new ProductName('');
    const description = new ProductDescription('');
    const image = new ProductImage('');
    const price = new ProductPrice(0);
    const brand = new ProductBrand('');
    const category = new ProductCategory('');
    const ean = new ProductEan('');

    return new Product(id, name, description, image, price, brand, category, ean);
  }

  public changeDescription(description: ProductDescription) {
    this.description = description;
    this.record(
      new ProductDescriptionChanged({
        aggregateId: this.id.value,
        description: description.value,
      })
    );
  }

  public changeImage(image: ProductImage) {
    this.image = image;
    this.record(new ProductImageChanged({ aggregateId: this.id.value, image: image.value }));
  }

  public applyProductCreated(event: ProductCreated): void {
    this.id = new ProductId(event.aggregateId);
    this.name = new ProductName(event.name);
    this.description = new ProductDescription(event.description);
    this.image = new ProductImage(event.image);
    this.price = new ProductPrice(event.price);
  }

  public applyProductDescriptionChanged(event: ProductDescriptionChanged): void {
    this.description = new ProductDescription(event.description);
  }

  public applyProductImageChanged(event: ProductImageChanged): void {
    this.image = new ProductImage(event.image);
  }

  static fromPrimitives(plainData: Primitives<Product>): Product {
    return new Product(
      new ProductId(plainData.id),
      new ProductName(plainData.name),
      new ProductDescription(plainData.description),
      new ProductImage(plainData.image),
      new ProductPrice(plainData.price),
      new ProductBrand(plainData.brand),
      new ProductCategory(plainData.category),
      new ProductEan(plainData.ean)
    );
  }

  toPrimitives(): Primitives<Product> {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
      image: this.image.value,
      price: this.price.value,
      brand: this.brand.value,
      category: this.category.value,
      ean: this.ean.value,
    };
  }

  applyEvent(event: DomainEvent): void {
    /*eslint indent: ["error", 2, {"SwitchCase": 1}]*/
    switch (event.eventName) {
      case 'product.created':
        this.applyProductCreated(event as ProductCreated);
        break;
      case 'product.description_changed':
        this.applyProductDescriptionChanged(event as ProductDescriptionChanged);
        break;
      case 'product.image_changed':
        this.applyProductImageChanged(event as ProductImageChanged);
        break;
      default:
        throw new Error(`Unsupported event: ${event.eventName}`);
    }
  }
}
