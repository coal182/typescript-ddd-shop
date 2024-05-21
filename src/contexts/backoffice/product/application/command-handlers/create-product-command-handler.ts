import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {ProductBrand} from '@shared/product/domain/product-brand';
import {ProductCategory} from '@shared/product/domain/product-category';
import {ProductDescription} from '@shared/product/domain/product-description';
import {ProductEan} from '@shared/product/domain/product-ean';
import {ProductId} from '@shared/product/domain/product-id';
import {ProductImage} from '@shared/product/domain/product-image';
import {ProductName} from '@shared/product/domain/product-name';
import {ProductPrice} from '@shared/product/domain/product-price';
import {CreateProductCommand} from 'src/contexts/backoffice/product/application/commands/create-product';

import {ProductCreator} from '../create/product-creator';

export class CreateProductCommandHandler implements CommandHandler<CreateProductCommand> {
    constructor(private productCreator: ProductCreator) {}

    subscribedTo(): Command {
        return CreateProductCommand;
    }

    async handle(command: CreateProductCommand): Promise<void> {
        const id = new ProductId(command.id);
        const name = new ProductName(command.name);
        const description = new ProductDescription(command.description);
        const images = command.images.map((image) => new ProductImage(image));
        const price = new ProductPrice(command.price);
        const brand = new ProductBrand(command.brand);
        const category = new ProductCategory(command.category);
        const ean = new ProductEan(command.ean);
        await this.productCreator.run({id, name, description, images, price, brand, category, ean});
    }
}
