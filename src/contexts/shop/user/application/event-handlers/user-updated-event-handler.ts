import { DomainEventClass } from '@shared/domain/domain-event';
import { DomainEventSubscriber } from '@shared/domain/domain-event-subscriber';
import { NotFoundException } from '@shared/domain/errors/application-error';
import { UserUpdated } from '@shop-backend/user/domain/events/user-updated';
import { User } from '@shop-backend/user/domain/user';
import { UserBirthdate } from '@shop-backend/user/domain/user-birthdate';
import { UserEmail } from '@shop-backend/user/domain/user-email';
import { UserEventStore } from '@shop-backend/user/domain/user-event-store';
import { UserFirstname } from '@shop-backend/user/domain/user-firstname';
import { UserId } from '@shop-backend/user/domain/user-id';
import { UserLastname } from '@shop-backend/user/domain/user-lastname';
import { UserRepository } from '@shop-backend/user/domain/user-repository';

export class UserUpdatedEventHandler implements DomainEventSubscriber<UserUpdated> {
  public event = UserUpdated.name;

  constructor(private eventStore: UserEventStore, private repository: UserRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [UserUpdated];
  }

  async on(domainEvent: UserUpdated): Promise<void> {
    const id = new UserId(domainEvent.aggregateId);
    const email = new UserEmail(domainEvent.email);
    const firstname = new UserFirstname(domainEvent.firstname);
    const lastname = new UserLastname(domainEvent.lastname);
    const dateOfBirth = new UserBirthdate(new Date(domainEvent.dateOfBirth));

    const events = await this.eventStore.findByAggregateId(id);
    if (!events) {
      throw new NotFoundException('User not found by its id');
    }

    const user = User.createEmptyUser(id);
    user.loadFromHistory(events);
    user.updateUser(email, firstname, lastname, dateOfBirth);
    await this.repository.save(user);
  }
}
