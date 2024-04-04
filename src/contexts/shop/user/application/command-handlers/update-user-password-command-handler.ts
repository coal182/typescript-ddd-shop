import { Command } from '@shared/domain/command';
import { CommandHandler } from '@shared/domain/command-handler';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { EventBus } from '@shared/domain/event-bus';
import { User } from '@shop-backend/user/domain/user';
import { UserEventStore } from '@shop-backend/user/domain/user-event-store';
import { UserId } from '@shop-backend/user/domain/user-id';
import { UserPassword } from '@shop-backend/user/domain/user-password';

import { UpdateUserPasswordCommand } from '../commands/update-user-password';

export class UpdateUserPasswordCommandHandler implements CommandHandler<UpdateUserPasswordCommand> {
  constructor(private eventBus: EventBus, private eventStore: UserEventStore) {}

  subscribedTo(): Command {
    return UpdateUserPasswordCommand;
  }

  async handle(command: UpdateUserPasswordCommand) {
    const id = new UserId(command.id);
    const password = new UserPassword(command.password);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('User not found by its id');
    }

    const user = User.initialize(id);
    user.loadFromHistory(events);
    user.changePassword(password);
    const newDomainEvents = user.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
