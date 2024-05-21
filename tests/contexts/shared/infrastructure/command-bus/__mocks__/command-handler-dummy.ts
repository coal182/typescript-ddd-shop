import {CommandHandler} from '@shared/domain/command-handler';

import {DummyCommand} from './dummy-command';

export class CommandHandlerDummy implements CommandHandler<DummyCommand> {
    subscribedTo(): DummyCommand {
        return DummyCommand;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(command: DummyCommand): Promise<void> {}
}
