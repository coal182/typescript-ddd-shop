import { CommandHandler } from '@shared/domain/command-handler';

import { DummyCommand } from './dummy-command';

export class CommandHandlerDummy implements CommandHandler<DummyCommand> {
  subscribedTo(): DummyCommand {
    return DummyCommand;
  }

  async handle(command: DummyCommand): Promise<void> {}
}
