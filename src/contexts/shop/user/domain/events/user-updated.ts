import {DomainEvent} from '@shared/domain/domain-event';

type UpdateUserDomainEventData = {
    readonly email: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly dateOfBirth: string;
};

export class UserUpdated extends DomainEvent {
    static readonly EVENT_NAME = 'user.updated';

    readonly email: string;
    readonly firstname: string;
    readonly lastname: string;
    readonly dateOfBirth: string;

    constructor({
        aggregateId,
        email,
        firstname,
        lastname,
        dateOfBirth,
        eventId,
        occurredOn,
    }: {
        aggregateId: string;
        email: string;
        firstname: string;
        lastname: string;
        dateOfBirth: string;
        eventId?: string;
        occurredOn?: Date;
    }) {
        super({eventName: UserUpdated.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.dateOfBirth = dateOfBirth;
    }

    toPrimitives(): UpdateUserDomainEventData {
        const {email, firstname, lastname, dateOfBirth} = this;
        return {
            email,
            firstname,
            lastname,
            dateOfBirth,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: UpdateUserDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new UserUpdated({
            aggregateId,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            dateOfBirth: data.dateOfBirth,
            eventId,
            occurredOn,
        });
    }
}
