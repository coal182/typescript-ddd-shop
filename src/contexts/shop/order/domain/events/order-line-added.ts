import { DomainEvent } from '@shared/domain/domain-event';

import { OrderLine } from '../order-line';

type OrderLineAddedDomainEventData = {
  readonly line: OrderLine;
};

export class OrderLineAdded extends DomainEvent {
  static readonly EVENT_NAME = 'order.line_added';

  readonly line: OrderLine;

  constructor({
    aggregateId,
    line,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    line: OrderLine;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: OrderLineAdded.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.line = line;
  }

  toPrimitives(): OrderLineAddedDomainEventData {
    const { line } = this;
    return {
      line,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: OrderLineAddedDomainEventData;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, data, occurredOn, eventId } = params;
    return new OrderLineAdded({
      aggregateId,
      line: data.line,
      eventId,
      occurredOn,
    });
  }
}
