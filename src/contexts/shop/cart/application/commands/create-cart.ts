import {Command} from '@shared/domain/command';

export class CreateCartCommand extends Command {
    constructor(
        public readonly id: string,
        public readonly userId: string,
    ) {
        super();
    }
}
