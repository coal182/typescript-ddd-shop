import { EventBus } from '@shared/domain/event-bus';
import { ProductEventStore } from '@shop-backend/product/domain/product-event-store';

import { BackofficeProduct } from '../../domain/backoffice-product';
import { BackofficeProductBrand } from '../../domain/backoffice-product-brand';
import { BackofficeProductCategory } from '../../domain/backoffice-product-category';
import { BackofficeProductDescription } from '../../domain/backoffice-product-description';
import { BackofficeProductEan } from '../../domain/backoffice-product-ean';
import { BackofficeProductId } from '../../domain/backoffice-product-id';
import { BackofficeProductImage } from '../../domain/backoffice-product-image';
import { BackofficeProductName } from '../../domain/backoffice-product-name';
import { BackofficeProductPrice } from '../../domain/backoffice-product-price';

export class BackofficeProductCreator {
  constructor(private eventBus: EventBus, private eventStore: ProductEventStore) {}

  async run(params: {
    id: BackofficeProductId;
    name: BackofficeProductName;
    description: BackofficeProductDescription;
    images: BackofficeProductImage[];
    price: BackofficeProductPrice;
    brand: BackofficeProductBrand;
    category: BackofficeProductCategory;
    ean: BackofficeProductEan;
  }): Promise<void> {
    const product = BackofficeProduct.create(
      params.id,
      params.name,
      params.description,
      params.images,
      params.price,
      params.brand,
      params.category,
      params.ean
    );

    const newDomainEvents = product.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
