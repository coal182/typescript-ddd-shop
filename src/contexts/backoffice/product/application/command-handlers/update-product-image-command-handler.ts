import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {NotFoundException} from '@shared/domain/errors/application-error';
import {EventBus} from '@shared/domain/event-bus';
import {ProductId} from '@shared/product/domain/product-id';
import {ProductImage} from '@shared/product/domain/product-image';
import {ProductEventStore} from '@shop-backend/product/domain/product-event-store';
import {Product} from 'src/contexts/shop/product/domain/product';

import {UpdateProductImageCommand} from '../commands/update-product-image';

export class UpdateProductImageCommandHandler implements CommandHandler<UpdateProductImageCommand> {
    constructor(
        private eventBus: EventBus,
        private eventStore: ProductEventStore,
    ) {}

    subscribedTo(): Command {
        return UpdateProductImageCommand;
    }

    async handle(command: UpdateProductImageCommand): Promise<void> {
        const id = new ProductId(command.id);
        const images = command.images.map((image) => new ProductImage(image));

        const events = await this.eventStore.findByAggregateId(id);
        if (!events) {
            throw new NotFoundException('Product not found by its id');
        }

        const product = Product.initialize(id);
        product.loadFromHistory(events);
        product.changeImages(images);
        const newDomainEvents = product.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
