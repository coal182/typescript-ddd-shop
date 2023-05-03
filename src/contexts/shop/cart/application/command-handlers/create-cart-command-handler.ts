import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { CartUser } from '@storeback/cart/domain/cart-user';
import { CreateCartCommand } from 'src/contexts/shop/cart/application/commands/create-cart';
import { CartId } from 'src/contexts/shop/cart/domain/cart-id';

import { CartCreator } from '../create/cart-creator';

export class CreateCartCommandHandler implements CommandHandler<CreateCartCommand> {
  constructor(private cartCreator: CartCreator) {}
  subscribedTo(): Command {
    return CreateCartCommand;
  }
  async handle(command: CreateCartCommand) {
    const id = new CartId(command.id);
    const userId = new CartUser(command.userId);
    await this.cartCreator.run({ id, userId });
  }
}
