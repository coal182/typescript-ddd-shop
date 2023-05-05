import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { ProductBrand } from '@storeback/product/domain/product-brand';
import { ProductCategory } from '@storeback/product/domain/product-category';
import { ProductEan } from '@storeback/product/domain/product-ean';
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
    const brand = new ProductBrand(command.brand);
    const category = new ProductCategory(command.category);
    const ean = new ProductEan(command.ean);
    await this.productCreator.run({ id, name, description, image, price, brand, category, ean });
  }
}
