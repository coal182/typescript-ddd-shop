import { IMessage } from './i-message';

export interface ICommand extends IMessage {
  guid: string;
}
