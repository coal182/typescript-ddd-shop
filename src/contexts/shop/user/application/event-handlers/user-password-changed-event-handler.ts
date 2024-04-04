import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { User } from '@shop-backend/user/domain/user';
import { UserEventStore } from '@shop-backend/user/domain/user-event-store';
import { UserId } from '@shop-backend/user/domain/user-id';
import { UserPassword } from '@shop-backend/user/domain/user-password';
import { UserRepository } from '@shop-backend/user/domain/user-repository';
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

    const user = User.initialize(id);
    user.loadFromHistory(events);
    user.changePassword(password);
    await this.repository.save(user);
  }
}
