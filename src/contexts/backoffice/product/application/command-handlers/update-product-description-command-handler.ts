import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { ProductDescription } from '@shared/product/domain/product-description';
import { ProductId } from '@shared/product/domain/product-id';
import { ProductEventStore } from '@shop-backend/product/domain/product-event-store';
import { Product } from 'src/contexts/shop/product/domain/product';

import { UpdateProductDescriptionCommand } from '../commands/update-product-description';

export class UpdateProductDescriptionCommandHandler implements CommandHandler<UpdateProductDescriptionCommand> {
  constructor(private eventBus: EventBus, private eventStore: ProductEventStore) {}

  subscribedTo(): Command {
    return UpdateProductDescriptionCommand;
  }

  async handle(command: UpdateProductDescriptionCommand) {
    const id = new ProductId(command.id);
    const description = new ProductDescription(command.description);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }

    const product = Product.createEmptyProduct(id);
    product.loadFromHistory(events);
    product.changeDescription(description);
    const newDomainEvents = product.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
