import { inject, injectable } from 'inversify';

import { AddItemToCartCommand } from '@commands/cart/AddItemToCart';
import { RemoveItemFromCartCommand } from '@commands/cart/RemoveItemFromCart';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { Cart } from '@domain/cart/Cart';
import { CartItem } from '@domain/cart/CartItem';
import { ICartRepository } from '@domain/cart/ICartRepository';

@injectable()
export class RemoveItemFromCartCommandHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = RemoveItemFromCartCommand.name;
  async handle(command: AddItemToCartCommand) {
    const cart: Cart = await this.repository.getById(command.guid);
    const item = new CartItem(command.bookId, command.qty, command.price);
    cart.removeItem(item);
    await this.repository.save(cart, command.originalVersion);
  }
}
