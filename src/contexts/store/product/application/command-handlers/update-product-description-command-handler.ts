import { Command } from '@shared/domain/Command';
import { CommandHandler } from '@shared/domain/CommandHandler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/EventBus';
import { UpdateProductDescriptionCommand } from '@storeback/product/application/commands/update-product-description';
import { Product } from '@storeback/product/domain/product';
import { ProductDescription } from '@storeback/product/domain/product-description';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductEventStore } from '@storeback/product/domain/ProductEventStore';

export class UpdateProductDescriptionCommandHandler implements CommandHandler<UpdateProductDescriptionCommand> {
  constructor(private eventBus: EventBus, private eventStore: ProductEventStore) {}

  subscribedTo(): Command {
    return UpdateProductDescriptionCommand;
  }

  async handle(command: UpdateProductDescriptionCommand) {
    console.log('📌 ~ handle command:', command);
    const id = new ProductId(command.id);
    const description = new ProductDescription(command.description);

    const events = await this.eventStore.findByAggregateId(id);
    console.log('📌 ~ UpdateProductDescriptionCommandHandler events:', events);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }

    const product = Product.createEmptyProduct(id);
    product.loadFromHistory(events);
    product.changeDescription(description);
    const newDomainEvents = product.pullDomainEvents();
    console.log('📌 ~ newDomainEvents:', newDomainEvents);
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
