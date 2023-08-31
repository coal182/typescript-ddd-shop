import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { ProductBrand } from '@shop-backend/product/domain/product-brand';
import { ProductCategory } from '@shop-backend/product/domain/product-category';
import { ProductEan } from '@shop-backend/product/domain/product-ean';
import { ProductCreated } from 'src/contexts/shop/product/domain/events/product-created';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { ProductPrice } from 'src/contexts/shop/product/domain/product-price';
import { ProductRepository } from 'src/contexts/shop/product/domain/product-repository';

export class ProductCreatedEventHandler implements DomainEventSubscriber<ProductCreated> {
  public event = ProductCreated.name;

  constructor(private repository: ProductRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [ProductCreated];
  }

  async on(domainEvent: ProductCreated): Promise<void> {
    const id = new ProductId(domainEvent.aggregateId);
    const name = new ProductName(domainEvent.name);
    const description = new ProductDescription(domainEvent.description);
    const images = domainEvent.images.map((image) => new ProductImage(image));
    const price = new ProductPrice(domainEvent.price);
    const brand = new ProductBrand(domainEvent.brand);
    const category = new ProductCategory(domainEvent.category);
    const ean = new ProductEan(domainEvent.ean);

    const product = new Product(id, name, description, images, price, brand, category, ean, true, new Date());
    await this.repository.save(product);
  }
}
