import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { UserBirthdate } from '@storeback/user/domain/user-birthdate';
import { UserEmail } from '@storeback/user/domain/user-email';
import { UserFirstname } from '@storeback/user/domain/user-firstname';
import { UserLastname } from '@storeback/user/domain/user-lastname';
import { UserPassword } from '@storeback/user/domain/user-password';
import { CreateUserCommand } from 'src/contexts/shop/user/application/commands/create-user';
import { UserId } from 'src/contexts/shop/user/domain/user-id';

import { UserCreator } from '../create/user-creator';

export class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
  constructor(private userCreator: UserCreator) {}

  subscribedTo(): Command {
    return CreateUserCommand;
  }
  async handle(command: CreateUserCommand): Promise<void> {
    const id = new UserId(command.id);
    const email = new UserEmail(command.email);
    const firstname = new UserFirstname(command.firstname);
    const lastname = new UserLastname(command.lastname);
    const dateOfBirth = new UserBirthdate(command.dateOfBirth);
    const password = new UserPassword(command.password);
    await this.userCreator.run({ id, email, firstname, lastname, dateOfBirth, password });
  }
}
