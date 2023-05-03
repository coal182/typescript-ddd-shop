import { DomainEvent } from '@shared/domain/domain-event';

type CartCreatedDomainEventData = {
  readonly userId: string;
};
export class CartCreated extends DomainEvent {
  static readonly EVENT_NAME = 'cart.created';

  readonly userId: string;

  constructor({
    aggregateId,
    userId,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    userId: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: CartCreated.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.userId = userId;
  }

  toPrimitives(): CartCreatedDomainEventData {
    const { userId } = this;
    return {
      userId,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: CartCreatedDomainEventData;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, data, occurredOn, eventId } = params;
    return new CartCreated({
      aggregateId,
      userId: data.userId,
      eventId,
      occurredOn,
    });
  }
}
