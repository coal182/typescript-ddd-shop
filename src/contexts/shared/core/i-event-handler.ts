import { IEvent } from './i-event';

export interface IEventHandler<T extends IEvent> {
  event: string;
  handle(event: T): void;
}
