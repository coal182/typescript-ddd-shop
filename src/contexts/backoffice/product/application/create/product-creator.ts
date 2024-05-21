import {EventBus} from '@shared/domain/event-bus';
import {ProductBrand} from '@shared/product/domain/product-brand';
import {ProductCategory} from '@shared/product/domain/product-category';
import {ProductDescription} from '@shared/product/domain/product-description';
import {ProductEan} from '@shared/product/domain/product-ean';
import {ProductImage} from '@shared/product/domain/product-image';
import {ProductName} from '@shared/product/domain/product-name';
import {ProductPrice} from '@shared/product/domain/product-price';
import {ProductEventStore} from '@shop-backend/product/domain/product-event-store';

import {ProductId} from '../../../../shared/product/domain/product-id';
import {Product} from '../../domain/product';

export class ProductCreator {
    constructor(
        private eventBus: EventBus,
        private eventStore: ProductEventStore,
    ) {}

    async run(params: {
        id: ProductId;
        name: ProductName;
        description: ProductDescription;
        images: ProductImage[];
        price: ProductPrice;
        brand: ProductBrand;
        category: ProductCategory;
        ean: ProductEan;
    }): Promise<void> {
        const product = Product.create(params.id, params.name, params.description, params.images, params.price, params.brand, params.category, params.ean);

        const newDomainEvents = product.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
