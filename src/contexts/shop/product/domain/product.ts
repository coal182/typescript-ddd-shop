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
  public images: ProductImage[];
  public price: ProductPrice;
  public brand: ProductBrand;
  public category: ProductCategory;
  public ean: ProductEan;
  public active: boolean;
  public createdAt: Date;

  constructor(
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
  ) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.images = images;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.ean = ean;
    this.active = active;
    this.createdAt = createdAt;
  }

  static create(
    id: ProductId,
    name: ProductName,
    description: ProductDescription,
    images: ProductImage[],
    price: ProductPrice,
    brand: ProductBrand,
    category: ProductCategory,
    ean: ProductEan
  ): Product {
    const product = new Product(id, name, description, images, price, brand, category, ean, true, new Date());

    product.record(
      new ProductCreated({
        aggregateId: product.id.value,
        name: product.name.value,
        description: product.description.value,
        images: product.images.map((image) => image.value),
        price: product.price.value,
        brand: product.brand.value,
        category: product.category.value,
        ean: product.ean.value,
        active: product.active,
        createdAt: product.createdAt,
      })
    );

    return product;
  }

  static createEmptyProduct(id: ProductId): Product {
    const name = new ProductName('');
    const description = new ProductDescription('');
    const images: Array<ProductImage> = [];
    const price = new ProductPrice(0);
    const brand = new ProductBrand('');
    const category = new ProductCategory('');
    const ean = new ProductEan('');

    return new Product(id, name, description, images, price, brand, category, ean, true, new Date());
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

  public changeImages(images: ProductImage[]) {
    this.images = images;
    this.record(new ProductImageChanged({ aggregateId: this.id.value, images: images.map((image) => image.value) }));
  }

  public applyProductCreated(event: ProductCreated): void {
    this.id = new ProductId(event.aggregateId);
    this.name = new ProductName(event.name);
    this.description = new ProductDescription(event.description);
    this.images = event.images.map((image) => new ProductImage(image));
    this.price = new ProductPrice(event.price);
  }

  public applyProductDescriptionChanged(event: ProductDescriptionChanged): void {
    this.description = new ProductDescription(event.description);
  }

  public applyProductImageChanged(event: ProductImageChanged): void {
    this.images = event.images.map((image) => new ProductImage(image));
  }

  static fromPrimitives(plainData: Primitives<Product>): Product {
    return new Product(
      new ProductId(plainData.id),
      new ProductName(plainData.name),
      new ProductDescription(plainData.description),
      plainData.images.map((image) => new ProductImage(image)),
      new ProductPrice(plainData.price),
      new ProductBrand(plainData.brand),
      new ProductCategory(plainData.category),
      new ProductEan(plainData.ean),
      plainData.active,
      plainData.createdAt
    );
  }

  toPrimitives(): Primitives<Product> {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
      images: this.images.map((image) => image.value),
      price: this.price.value,
      brand: this.brand.value,
      category: this.category.value,
      ean: this.ean.value,
      active: this.active,
      createdAt: this.createdAt,
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
