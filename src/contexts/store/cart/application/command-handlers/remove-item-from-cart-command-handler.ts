import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { RemoveItemFromCartCommand } from '@storeback/cart/application/commands/remove-item-from-cart';
import { Cart } from '@storeback/cart/domain/cart';
import { CartItem } from '@storeback/cart/domain/cart-item';
import { ICartRepository } from '@storeback/cart/domain/i-cart-repository';

@injectable()
export class RemoveItemFromCartCommandHandler implements ICommandHandler<RemoveItemFromCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = RemoveItemFromCartCommand.name;
  async handle(command: RemoveItemFromCartCommand) {
    const cart: Cart = await this.repository.getById(command.guid);
    const item = new CartItem(command.bookId, command.qty, command.price);
    cart.removeItem(item);
    await this.repository.save(cart, command.originalVersion);
  }
}
