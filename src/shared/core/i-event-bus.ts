import { IEvent } from './i-event';

export interface IEventBus {
  publish(channel: string, event: IEvent): Promise<void>;
  subscribeEvents(): Promise<void>;
}
