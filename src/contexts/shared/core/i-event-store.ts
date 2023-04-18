import { IEvent } from './i-event';

export interface IEventStore {
  saveEvents(aggregateGuid: string, eventHistory: IEvent[], version: number): void;
  getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]>;
}
