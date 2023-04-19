import { Command } from '@shared/domain/Command';
import { CommandHandler } from '@shared/domain/CommandHandler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/EventBus';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductEventStore } from 'src/contexts/shop/product/domain/ProductEventStore';

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
