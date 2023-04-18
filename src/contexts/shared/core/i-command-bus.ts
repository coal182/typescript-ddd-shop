import { ICommandHandler } from './i-command-handler';

export interface ICommandBus {
  registerHandler<TCommand>(commandName: string, handler: ICommandHandler<TCommand>): void;
  send<TCommand>(command: TCommand): void;
}
