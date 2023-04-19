import { Command } from '@shared/domain/Command';
import { CommandHandler } from '@shared/domain/CommandHandler';
import { CreateProductCommand } from '@storeback/product/application/commands/create-product';
import { ProductDescription } from '@storeback/product/domain/product-description';
import { ProductId } from '@storeback/product/domain/product-id';
import { ProductImage } from '@storeback/product/domain/product-image';
import { ProductName } from '@storeback/product/domain/product-name';
import { ProductPrice } from '@storeback/product/domain/product-price';

import { ProductCreator } from '../create/product-creator';

export class CreateProductCommandHandler implements CommandHandler<CreateProductCommand> {
  constructor(private productCreator: ProductCreator) {}

  subscribedTo(): Command {
    return CreateProductCommand;
  }

  async handle(command: CreateProductCommand): Promise<void> {
    const id = new ProductId(command.id);
    const name = new ProductName(command.name);
    const description = new ProductDescription(command.description);
    const image = new ProductImage(command.image);
    const price = new ProductPrice(command.price);
    await this.productCreator.run({ id, name, description, image, price });
  }
}
