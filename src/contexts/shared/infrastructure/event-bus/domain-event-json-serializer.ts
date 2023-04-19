import { DomainEvent } from '../../domain/domain-event';

export class DomainEventJsonSerializer {
  static serialize(event: DomainEvent): string {
    return JSON.stringify({
      data: {
        id: event.eventId,
        type: event.eventName,
        occurred_on: event.occurredOn.toISOString(),
        aggregateId: event.aggregateId,
        data: event.toPrimitives(),
      },
    });
  }
}
