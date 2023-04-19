import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductEventStore } from 'src/contexts/shop/product/domain/product-event-store';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';

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
