import { Command } from '../../domain/Command';

import { CommandBus } from './../../domain/CommandBus';
import { CommandHandlers } from './CommandHandlers';

export class InMemoryCommandBus implements CommandBus {
  constructor(private commandHandlers: CommandHandlers) {}

  async dispatch(command: Command): Promise<void> {
    console.log('📌 ~ command:', command);
    const handler = this.commandHandlers.get(command);

    await handler.handle(command);
  }
}
