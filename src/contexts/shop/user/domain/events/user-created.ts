import { DomainEvent } from '@shared/domain/domain-event';

type CreateUserDomainEventData = {
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly dateOfBirth: Date;
  readonly password: string;
};

export class UserCreated extends DomainEvent {
  static readonly EVENT_NAME = 'user.created';

  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly dateOfBirth: Date;
  readonly password: string;

  constructor({
    aggregateId,
    email,
    firstname,
    lastname,
    dateOfBirth,
    password,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    email: string;
    firstname: string;
    lastname: string;
    dateOfBirth: Date;
    password: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: UserCreated.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
  }

  toPrimitives(): CreateUserDomainEventData {
    const { email, firstname, lastname, dateOfBirth, password } = this;
    return {
      email,
      firstname,
      lastname,
      dateOfBirth,
      password,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: CreateUserDomainEventData;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, data, occurredOn, eventId } = params;
    return new UserCreated({
      aggregateId,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      dateOfBirth: data.dateOfBirth,
      password: data.password,
      eventId,
      occurredOn,
    });
  }
}
