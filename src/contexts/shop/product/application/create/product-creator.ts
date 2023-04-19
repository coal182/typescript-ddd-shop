import { EventBus } from '@shared/domain/EventBus';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { ProductPrice } from 'src/contexts/shop/product/domain/product-price';
import { ProductEventStore } from 'src/contexts/shop/product/domain/ProductEventStore';

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
