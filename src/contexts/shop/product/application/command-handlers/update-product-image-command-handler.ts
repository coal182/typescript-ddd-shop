import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { UpdateProductImageCommand } from 'src/contexts/shop/product/application/commands/update-product-image';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductEventStore } from 'src/contexts/shop/product/domain/product-event-store';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';

export class UpdateProductImageCommandHandler implements CommandHandler<UpdateProductImageCommand> {
  constructor(private eventBus: EventBus, private eventStore: ProductEventStore) {}

  subscribedTo(): Command {
    return UpdateProductImageCommand;
  }

  async handle(command: UpdateProductImageCommand) {
    const id = new ProductId(command.id);
    const image = new ProductImage(command.image);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('Product not found by its id');
    }

    const product = Product.createEmptyProduct(id);
    product.loadFromHistory(events);
    product.changeImage(image);
    const newDomainEvents = product.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
