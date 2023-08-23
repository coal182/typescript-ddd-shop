/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AggregateRoot } from '@shared/domain/aggregate-root';
import { DomainEvent } from '@shared/domain/domain-event';
import { ProductCreated } from '@shop-backend/product/domain/events/product-created';
import { ProductDescriptionChanged } from '@shop-backend/product/domain/events/product-description-changed';
import { ProductImageChanged } from '@shop-backend/product/domain/events/product-image-changed';

import { BackofficeProductBrand } from './backoffice-product-brand';
import { BackofficeProductCategory } from './backoffice-product-category';
import { BackofficeProductDescription } from './backoffice-product-description';
import { BackofficeProductEan } from './backoffice-product-ean';
import { BackofficeProductId } from './backoffice-product-id';
import { BackofficeProductImage } from './backoffice-product-image';
import { BackofficeProductName } from './backoffice-product-name';
import { BackofficeProductPrice } from './backoffice-product-price';
export class BackofficeProduct extends AggregateRoot {
  public id: BackofficeProductId;
  public name: BackofficeProductName;
  public description: BackofficeProductDescription;
  public image: BackofficeProductImage;
  public price: BackofficeProductPrice;
  public brand: BackofficeProductBrand;
  public category: BackofficeProductCategory;
  public ean: BackofficeProductEan;

  constructor(
    id: BackofficeProductId,
    name: BackofficeProductName,
    description: BackofficeProductDescription,
    image: BackofficeProductImage,
    price: BackofficeProductPrice,
    brand: BackofficeProductBrand,
    category: BackofficeProductCategory,
    ean: BackofficeProductEan
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
    id: BackofficeProductId,
    name: BackofficeProductName,
    description: BackofficeProductDescription,
    image: BackofficeProductImage,
    price: BackofficeProductPrice,
    brand: BackofficeProductBrand,
    category: BackofficeProductCategory,
    ean: BackofficeProductEan
  ): BackofficeProduct {
    const product = new BackofficeProduct(id, name, description, image, price, brand, category, ean);

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

  static createEmptyProduct(id: BackofficeProductId): BackofficeProduct {
    const name = new BackofficeProductName('');
    const description = new BackofficeProductDescription('');
    const image = new BackofficeProductImage('');
    const price = new BackofficeProductPrice(0);
    const brand = new BackofficeProductBrand('');
    const category = new BackofficeProductCategory('');
    const ean = new BackofficeProductEan('');

    return new BackofficeProduct(id, name, description, image, price, brand, category, ean);
  }

  public changeDescription(description: BackofficeProductDescription) {
    this.description = description;
    this.record(
      new ProductDescriptionChanged({
        aggregateId: this.id.value,
        description: description.value,
      })
    );
  }

  public changeImage(image: BackofficeProductImage) {
    this.image = image;
    this.record(new ProductImageChanged({ aggregateId: this.id.value, image: image.value }));
  }

  public applyProductCreated(event: ProductCreated): void {
    this.id = new BackofficeProductId(event.aggregateId);
    this.name = new BackofficeProductName(event.name);
    this.description = new BackofficeProductDescription(event.description);
    this.image = new BackofficeProductImage(event.image);
    this.price = new BackofficeProductPrice(event.price);
  }

  public applyProductDescriptionChanged(event: ProductDescriptionChanged): void {
    this.description = new BackofficeProductDescription(event.description);
  }

  public applyProductImageChanged(event: ProductImageChanged): void {
    this.image = new BackofficeProductImage(event.image);
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    brand: string;
    category: string;
    ean: string;
  }): BackofficeProduct {
    return new BackofficeProduct(
      new BackofficeProductId(plainData.id),
      new BackofficeProductName(plainData.name),
      new BackofficeProductDescription(plainData.description),
      new BackofficeProductImage(plainData.image),
      new BackofficeProductPrice(plainData.price),
      new BackofficeProductBrand(plainData.brand),
      new BackofficeProductCategory(plainData.category),
      new BackofficeProductEan(plainData.ean)
    );
  }

  toPrimitives() {
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
