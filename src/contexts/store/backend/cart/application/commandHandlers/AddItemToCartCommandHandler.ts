import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { AddItemToCartCommand } from '@storeback/cart/application/commands/AddItemToCart';
import { Cart } from '@storeback/cart/domain/Cart';
import { CartItem } from '@storeback/cart/domain/CartItem';
import { ICartRepository } from '@storeback/cart/domain/ICartRepository';

@injectable()
export class AddItemToCartCommandHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = AddItemToCartCommand.name;
  async handle(command: AddItemToCartCommand) {
    const cart: Cart = await this.repository.getById(command.guid);
    const item = new CartItem(command.bookId, command.qty, command.price);
    cart.addItem(item);
    await this.repository.save(cart, command.originalVersion);
  }
}
