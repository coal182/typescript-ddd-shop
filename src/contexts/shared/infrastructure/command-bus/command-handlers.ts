import {Command} from '../../domain/command';
import {CommandHandler} from '../../domain/command-handler';
import {CommandNotRegisteredError} from '../../domain/command-not-registered-error';

export class CommandHandlers extends Map<Command, CommandHandler<Command>> {
    constructor(commandHandlers: Array<CommandHandler<Command>>) {
        super();

        commandHandlers.forEach((commandHandler) => {
            this.set(commandHandler.subscribedTo(), commandHandler);
        });
    }

    public get(command: Command): CommandHandler<Command> {
        const commandHandler = super.get(command.constructor);

        if (!commandHandler) {
            throw new CommandNotRegisteredError(command);
        }

        return commandHandler;
    }
}
