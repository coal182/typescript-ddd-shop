import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { ProductCreated } from 'src/contexts/shop/product/domain/events/product-created';

import { BackofficeProduct } from '../../domain/backoffice-product';
import { BackofficeProductBrand } from '../../domain/backoffice-product-brand';
import { BackofficeProductCategory } from '../../domain/backoffice-product-category';
import { BackofficeProductDescription } from '../../domain/backoffice-product-description';
import { BackofficeProductEan } from '../../domain/backoffice-product-ean';
import { BackofficeProductId } from '../../domain/backoffice-product-id';
import { BackofficeProductImage } from '../../domain/backoffice-product-image';
import { BackofficeProductName } from '../../domain/backoffice-product-name';
import { BackofficeProductPrice } from '../../domain/backoffice-product-price';
import { BackofficeProductRepository } from '../../domain/backoffice-product-repository';

export class CreateBackofficeProductOnProductCreatedEventHandler implements DomainEventSubscriber<ProductCreated> {
  public event = ProductCreated.name;

  constructor(private repository: BackofficeProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductCreated];
  }

  async on(domainEvent: ProductCreated): Promise<void> {
    const id = new BackofficeProductId(domainEvent.aggregateId);
    const name = new BackofficeProductName(domainEvent.name);
    const description = new BackofficeProductDescription(domainEvent.description);
    const image = new BackofficeProductImage(domainEvent.image);
    const price = new BackofficeProductPrice(domainEvent.price);
    const brand = new BackofficeProductBrand(domainEvent.brand);
    const category = new BackofficeProductCategory(domainEvent.category);
    const ean = new BackofficeProductEan(domainEvent.ean);

    const product = new BackofficeProduct(id, name, description, image, price, brand, category, ean);
    await this.repository.save(product);
  }
}
