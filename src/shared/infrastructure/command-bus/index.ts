import { injectable } from 'inversify';

import { ICommand } from '@core/i-command';
import { ICommandHandler } from '@core/i-command-handler';

import 'reflect-metadata';

@injectable()
export class CommandBus {
  public handlers: Map<string, ICommandHandler<ICommand>> = new Map();

  public registerHandler<T extends ICommand = ICommand>(commandName: string, handler: ICommandHandler<T>) {
    if (this.handlers.has(commandName)) {
      return;
    }
    this.handlers.set(commandName, handler);
  }

  public async send(command: ICommand) {
    if (this.handlers.has(command.constructor.name)) {
      await (this.handlers.get(command.constructor.name) as ICommandHandler<ICommand>).handle(command);
    }
  }
}
