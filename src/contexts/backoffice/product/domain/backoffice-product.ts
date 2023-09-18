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

export interface BackofficeProductPrimitives {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  brand: string;
  category: string;
  ean: string;
  active: boolean;
  createdAt: Date;
}

export interface BackofficeProductModel {
  id: BackofficeProductId;
  name: BackofficeProductName;
  description: BackofficeProductDescription;
  images: BackofficeProductImage[];
  price: BackofficeProductPrice;
  brand: BackofficeProductBrand;
  category: BackofficeProductCategory;
  ean: BackofficeProductEan;
  active: boolean;
  createdAt: Date;
}

export class BackofficeProduct extends AggregateRoot {
  private name: BackofficeProductName;
  private description: BackofficeProductDescription;
  private images: BackofficeProductImage[];
  private price: BackofficeProductPrice;
  private brand: BackofficeProductBrand;
  private category: BackofficeProductCategory;
  private ean: BackofficeProductEan;
  private active: boolean;
  private createdAt: Date;

  constructor(
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
    id: BackofficeProductId,
    name: BackofficeProductName,
    description: BackofficeProductDescription,
    images: BackofficeProductImage[],
    price: BackofficeProductPrice,
    brand: BackofficeProductBrand,
    category: BackofficeProductCategory,
    ean: BackofficeProductEan
  ): BackofficeProduct {
    const product = new BackofficeProduct(id, name, description, images, price, brand, category, ean, true, new Date());

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

  static createEmptyProduct(id: BackofficeProductId): BackofficeProduct {
    const name = new BackofficeProductName('');
    const description = new BackofficeProductDescription('');
    const images = [new BackofficeProductImage('')];
    const price = new BackofficeProductPrice(0);
    const brand = new BackofficeProductBrand('');
    const category = new BackofficeProductCategory('');
    const ean = new BackofficeProductEan('');

    return new BackofficeProduct(id, name, description, images, price, brand, category, ean, true, new Date());
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

  public changeImages(images: BackofficeProductImage[]) {
    this.images = images;
    this.record(new ProductImageChanged({ aggregateId: this.id.value, images: images.map((image) => image.value) }));
  }

  public applyProductCreated(event: ProductCreated): void {
    this.id = new BackofficeProductId(event.aggregateId);
    this.name = new BackofficeProductName(event.name);
    this.description = new BackofficeProductDescription(event.description);
    this.images = event.images.map((image) => new BackofficeProductImage(image));
    this.price = new BackofficeProductPrice(event.price);
  }

  public applyProductDescriptionChanged(event: ProductDescriptionChanged): void {
    this.description = new BackofficeProductDescription(event.description);
  }

  public applyProductImageChanged(event: ProductImageChanged): void {
    this.images = event.images.map((image) => new BackofficeProductImage(image));
  }

  static fromPrimitives(plainData: BackofficeProductPrimitives): BackofficeProduct {
    return new BackofficeProduct(
      new BackofficeProductId(plainData.id),
      new BackofficeProductName(plainData.name),
      new BackofficeProductDescription(plainData.description),
      plainData.images.map((image) => new BackofficeProductImage(image)),
      new BackofficeProductPrice(plainData.price),
      new BackofficeProductBrand(plainData.brand),
      new BackofficeProductCategory(plainData.category),
      new BackofficeProductEan(plainData.ean),
      plainData.active,
      plainData.createdAt
    );
  }

  toPrimitives(): BackofficeProductPrimitives {
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
