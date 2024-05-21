import {DomainEvent} from '@shared/domain/domain-event';

type ChangeUserPasswordDomainEventData = {
    readonly password: string;
};

export class UserPasswordChanged extends DomainEvent {
    static readonly EVENT_NAME = 'user.password_changed';

    readonly password: string;

    constructor({aggregateId, password, eventId, occurredOn}: {aggregateId: string; password: string; eventId?: string; occurredOn?: Date}) {
        super({eventName: UserPasswordChanged.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.password = password;
    }

    toPrimitives(): ChangeUserPasswordDomainEventData {
        const {password} = this;
        return {
            password,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: ChangeUserPasswordDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new UserPasswordChanged({
            aggregateId,
            password: data.password,
            eventId,
            occurredOn,
        });
    }
}
