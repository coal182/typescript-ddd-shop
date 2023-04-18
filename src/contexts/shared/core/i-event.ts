import { IMessage } from './i-message';

export interface IEvent extends IMessage {
  eventName: string;
  aggregateName: string;
  version?: number;
}
