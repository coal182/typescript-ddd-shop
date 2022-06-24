import { inject, injectable } from 'inversify';

import { CreateCartCommand } from '@commands/cart/CreateCart';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { Cart } from '@domain/cart/Cart';
import { ICartRepository } from '@domain/cart/ICartRepository';

@injectable()
export class CreateCartCommandHandler implements ICommandHandler<CreateCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = CreateCartCommand.name;
  async handle(command: CreateCartCommand) {
    const cart: Cart = new Cart(command.guid, command.userId);
    await this.repository.save(cart, -1);
  }
}
