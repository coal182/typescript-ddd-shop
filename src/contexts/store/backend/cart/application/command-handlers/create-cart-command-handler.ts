import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { CreateCartCommand } from '@storeback/cart/application/commands/create-cart';
import { Cart } from '@storeback/cart/domain/cart';
import { CartId } from '@storeback/cart/domain/cart-id';
import { ICartRepository } from '@storeback/cart/domain/i-cart-repository';

@injectable()
export class CreateCartCommandHandler implements ICommandHandler<CreateCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = CreateCartCommand.name;
  async handle(command: CreateCartCommand) {
    const cart: Cart = new Cart(new CartId(command.guid), command.userId);
    await this.repository.save(cart, -1);
  }
}
