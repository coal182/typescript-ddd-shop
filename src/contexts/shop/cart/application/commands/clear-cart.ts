import {Command} from '@shared/domain/command';

export class ClearCartCommand extends Command {
    constructor(public readonly id: string) {
        super();
    }
}
