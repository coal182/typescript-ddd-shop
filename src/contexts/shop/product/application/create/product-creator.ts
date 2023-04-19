import { EventBus } from '@shared/domain/event-bus';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductEventStore } from 'src/contexts/shop/product/domain/product-event-store';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { ProductPrice } from 'src/contexts/shop/product/domain/product-price';

export class ProductCreator {
  constructor(private eventBus: EventBus, private eventStore: ProductEventStore) {}

  async run(params: {
    id: ProductId;
    name: ProductName;
    description: ProductDescription;
    image: ProductImage;
    price: ProductPrice;
  }): Promise<void> {
    const product = Product.create(params.id, params.name, params.description, params.image, params.price);

    const newDomainEvents = product.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
