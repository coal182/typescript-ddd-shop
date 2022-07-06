import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { UpdateUserCommand } from '@storeback/user/application/commands/UpdateUser';
import { IUserRepository } from '@storeback/user/domain/IUserRepository';

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
