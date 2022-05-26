import { inject, injectable } from 'inversify';

import { UpdateUserPasswordCommand } from '@commands/user/UpdateUserPassword';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { IUserRepository } from '@domain/user/IUserRepository';

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
