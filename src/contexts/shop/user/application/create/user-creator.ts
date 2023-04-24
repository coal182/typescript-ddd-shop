import { EventBus } from '@shared/domain/event-bus';
import { User } from '@storeback/user/domain/user';
import { UserBirthdate } from '@storeback/user/domain/user-birthdate';
import { UserEmail } from '@storeback/user/domain/user-email';
import { UserEventStore } from '@storeback/user/domain/user-event-store';
import { UserFirstname } from '@storeback/user/domain/user-firstname';
import { UserId } from '@storeback/user/domain/user-id';
import { UserLastname } from '@storeback/user/domain/user-lastname';
import { UserPassword } from '@storeback/user/domain/user-password';

export class UserCreator {
  constructor(private eventBus: EventBus, private eventStore: UserEventStore) {}

  async run(params: {
    id: UserId;
    email: UserEmail;
    firstname: UserFirstname;
    lastname: UserLastname;
    dateOfBirth: UserBirthdate;
    password: UserPassword;
  }): Promise<void> {
    const product = User.create(
      params.id,
      params.email,
      params.firstname,
      params.lastname,
      params.dateOfBirth,
      params.password
    );

    const newDomainEvents = product.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
