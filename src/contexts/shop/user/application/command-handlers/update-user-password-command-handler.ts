import { inject, injectable } from 'inversify';

import { TYPES } from '@storeback/shared/constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { UpdateUserPasswordCommand } from 'src/contexts/shop/user/application/commands/update-user-password';
import { IUserRepository } from 'src/contexts/shop/user/domain/i-user-repository';

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
