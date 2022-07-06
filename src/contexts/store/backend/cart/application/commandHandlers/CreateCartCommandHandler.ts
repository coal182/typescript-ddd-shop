import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { CreateCartCommand } from '@storeback/cart/application/commands/CreateCart';
import { Cart } from '@storeback/cart/domain/Cart';
import { ICartRepository } from '@storeback/cart/domain/ICartRepository';

@injectable()
export class CreateCartCommandHandler implements ICommandHandler<CreateCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = CreateCartCommand.name;
  async handle(command: CreateCartCommand) {
    const cart: Cart = new Cart(command.guid, command.userId);
    await this.repository.save(cart, -1);
  }
}
