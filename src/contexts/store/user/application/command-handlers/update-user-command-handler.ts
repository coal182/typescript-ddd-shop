import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { UpdateUserCommand } from '@storeback/user/application/commands/update-user';
import { IUserRepository } from '@storeback/user/domain/i-user-repository';

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
