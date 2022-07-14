import { ConcurrencyException, NotFoundException } from '@core/application-error';
import { EventDescriptor } from '@core/event-descriptor';
import { IEvent } from '@core/i-event';
import { IEventStore } from '@core/i-event-store';

export abstract class EventStoreMock implements IEventStore {
  private eventCollection: Array<EventDescriptor>;

  constructor() {
    this.eventCollection = [];
  }

  async saveEvents(aggregateGuid: string, events: IEvent[], expectedVersion: number) {
    const latestEvent = await this.getLastEventDescriptor(aggregateGuid);

    if (latestEvent && latestEvent.version !== expectedVersion && expectedVersion !== -1) {
      throw new ConcurrencyException('Cannot perform the operation due to internal conflict');
    }

    let i: number = expectedVersion;

    for (const event of events) {
      i++;
      event.version = i;
      const eventObject = new EventDescriptor(aggregateGuid, event.aggregateName, event, i);
      this.eventCollection.push(eventObject);
    }
  }

  async getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]> {
    const events = await this.eventCollection.filter((a) => a.aggregateGuid === aggregateGuid);
    if (!events) {
      throw new NotFoundException('Aggregate with the requested Guid does not exist');
    }
    return events.map((eventDescriptor: EventDescriptor) => eventDescriptor.data);
  }

  private async getLastEventDescriptor(aggregateGuid: string) {
    const latestEvent = await this.eventCollection
      .slice()
      .reverse()
      .find((a) => a.aggregateGuid === aggregateGuid);
    return latestEvent;
  }
}
