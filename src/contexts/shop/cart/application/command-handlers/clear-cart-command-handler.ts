import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { Cart } from 'src/contexts/shop/cart/domain/cart';
import { ICartRepository } from 'src/contexts/shop/cart/domain/i-cart-repository';

import { ClearCartCommand } from '../commands/clear-cart';

@injectable()
export class ClearCartCommandHandler implements ICommandHandler<ClearCartCommand> {
  constructor(@inject(TYPES.CartRepository) private readonly repository: ICartRepository) {}
  public static commandToHandle: string = ClearCartCommand.name;
  async handle(command: ClearCartCommand) {
    const cart: Cart = await this.repository.getById(command.guid);
    cart.clear();
    await this.repository.save(cart, command.originalVersion);
  }
}
