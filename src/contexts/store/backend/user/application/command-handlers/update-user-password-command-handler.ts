import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { UpdateUserPasswordCommand } from '@storeback/user/application/commands/update-user-password';
import { IUserRepository } from '@storeback/user/domain/i-user-repository';

@injectable()
export class UpdateUserPasswordCommandHandler implements ICommandHandler<UpdateUserPasswordCommand> {
  public static commandToHandle: string = UpdateUserPasswordCommand.name;

  constructor(@inject(TYPES.UserRepository) private readonly repository: IUserRepository) {}

  async handle(command: UpdateUserPasswordCommand) {
    const user = await this.repository.getById(command.guid);
    user.changePassword(command.password);
    await this.repository.save(user, command.originalVersion);
  }
}
