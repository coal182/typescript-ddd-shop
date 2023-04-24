import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { User } from '@storeback/user/domain/user';
import { UserEventStore } from '@storeback/user/domain/user-event-store';
import { UserId } from '@storeback/user/domain/user-id';
import { UserPassword } from '@storeback/user/domain/user-password';
import { UserRepository } from '@storeback/user/domain/user-repository';
import { UserPasswordChanged } from 'src/contexts/shop/user/domain/events/user-password-changed';

export class UserPasswordChangedEventHandler implements DomainEventSubscriber<UserPasswordChanged> {
  public event = UserPasswordChanged.name;

  constructor(private eventStore: UserEventStore, private repository: UserRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [UserPasswordChanged];
  }

  async on(domainEvent: UserPasswordChanged): Promise<void> {
    const id = new UserId(domainEvent.aggregateId);
    const password = new UserPassword(domainEvent.password);

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('User not found by its id');
    }

    const user = User.createEmptyUser(id);
    user.loadFromHistory(events);
    user.changePassword(password);
    await this.repository.save(user);
  }
}
