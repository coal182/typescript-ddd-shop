import {Command} from '@shared/domain/command';

export class DummyCommand extends Command {
    static COMMAND_NAME = 'handled.command';
}
