import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { CreateUserCommand } from 'src/contexts/shop/user/application/commands/create-user';
import { IUserRepository } from 'src/contexts/shop/user/domain/i-user-repository';
import { User } from 'src/contexts/shop/user/domain/user';
import { UserId } from 'src/contexts/shop/user/domain/user-id';

@injectable()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  public static commandToHandle: string = CreateUserCommand.name;

  constructor(@inject(TYPES.UserRepository) private readonly repository: IUserRepository) {}

  async handle(command: CreateUserCommand) {
    const user = new User(
      new UserId(command.guid),
      command.email,
      command.firstname,
      command.lastname,
      command.dateOfBirth,
      command.password
    );
    this.repository.save(user, -1);
  }
}
