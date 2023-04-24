import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { User } from '@storeback/user/domain/user';
import { UserBirthdate } from '@storeback/user/domain/user-birthdate';
import { UserEmail } from '@storeback/user/domain/user-email';
import { UserEventStore } from '@storeback/user/domain/user-event-store';
import { UserFirstname } from '@storeback/user/domain/user-firstname';
import { UserId } from '@storeback/user/domain/user-id';
import { UserLastname } from '@storeback/user/domain/user-lastname';
import { UpdateUserCommand } from 'src/contexts/shop/user/application/commands/update-user';

export class UpdateUserCommandHandler implements CommandHandler<UpdateUserCommand> {
  constructor(private eventBus: EventBus, private eventStore: UserEventStore) {}

  subscribedTo(): Command {
    return UpdateUserCommand;
  }

  async handle(command: UpdateUserCommand) {
    console.log('📌 ~ command:', command);
    const id = new UserId(command.id);
    const email = new UserEmail(command.email);
    const firstname = new UserFirstname(command.firstname);
    const lastname = new UserLastname(command.lastname);
    const dateOfBirth = new UserBirthdate(command.dateOfBirth);
    console.log('📌 ~ dateOfBirth:', dateOfBirth);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      console.log('📌 ~ User not found by its id');
      throw new NotFoundException('User not found by its id');
    }

    const user = User.createEmptyUser(id);
    user.loadFromHistory(events);
    user.updateUser(email, firstname, lastname, dateOfBirth);
    console.log('📌 ~ user:', user);
    const newDomainEvents = user.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
