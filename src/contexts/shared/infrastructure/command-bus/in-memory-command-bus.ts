import {CommandHandlers} from './command-handlers';

import {Command} from '../../domain/command';
import {CommandBus} from '../../domain/command-bus';

export class InMemoryCommandBus implements CommandBus {
    constructor(private commandHandlers: CommandHandlers) {}

    async dispatch(command: Command): Promise<void> {
        const handler = this.commandHandlers.get(command);

        await handler.handle(command);
    }
}
