import { EventBus } from '@shared/domain/EventBus';
import { Product } from '@storeback/product/domain/product';
import { ProductDescription } from '@storeback/product/domain/product-description';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductImage } from '@storeback/product/domain/product-image';
import { ProductName } from '@storeback/product/domain/product-name';
import { ProductPrice } from '@storeback/product/domain/product-price';
import { ProductEventStore } from '@storeback/product/domain/ProductEventStore';

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
