import { UserCreated } from '@shop-backend/user/domain/events/user-created';
import { User } from '@shop-backend/user/domain/user';

export class UserCreatedDomainEventMother {
  static create({
    aggregateId,
    eventId,
    email,
    firstname,
    lastname,
    dateOfBirth,
    password,
    occurredOn,
  }: {
    aggregateId: string;
    eventId?: string;
    email: string;
    firstname: string;
    lastname: string;
    dateOfBirth: Date;
    password: string;
    createdAt: Date;
    occurredOn?: Date;
  }): UserCreatedDomainEventMother {
    return new UserCreated({
      aggregateId,
      eventId,
      email,
      firstname,
      lastname,
      dateOfBirth,
      password,
      occurredOn,
    });
  }

  static fromUser(user: User): UserCreated {
    return new UserCreated({
      aggregateId: user.getId(),
      email: user.toPrimitives().email,
      firstname: user.toPrimitives().firstname,
      lastname: user.toPrimitives().lastname,
      dateOfBirth: user.toPrimitives().dateOfBirth,
      password: user.toPrimitives().password,
    });
  }
}
