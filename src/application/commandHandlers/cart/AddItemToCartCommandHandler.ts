import { inject, injectable } from 'inversify';

import { AddItemToCartCommand } from '@commands/cart/AddItemToCart';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { Cart } from '@domain/cart/Cart';
import { CartItem } from '@domain/cart/CartItem';
import { ICartRepository } from '@domain/cart/ICartRepository';

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
