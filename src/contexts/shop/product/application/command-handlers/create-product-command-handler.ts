import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';
import { ProductDescription } from 'src/contexts/shop/product/domain/product-description';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductImage } from 'src/contexts/shop/product/domain/product-image';
import { ProductName } from 'src/contexts/shop/product/domain/product-name';
import { ProductPrice } from 'src/contexts/shop/product/domain/product-price';

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
