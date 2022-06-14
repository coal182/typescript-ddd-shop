import { inject, injectable } from 'inversify';

import { UpdateUserCommand } from '@commands/user/UpdateUser';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { IUserRepository } from '@domain/user/IUserRepository';

@injectable()
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  public static commandToHandle: string = UpdateUserCommand.name;

  constructor(@inject(TYPES.UserRepository) private readonly repository: IUserRepository) {}

  async handle(command: UpdateUserCommand) {
    const user = await this.repository.getById(command.guid);
    user.updateUser(command.email, command.firstname, command.lastname, command.dateOfBirth);
    await this.repository.save(user, command.originalVersion);
  }
}
