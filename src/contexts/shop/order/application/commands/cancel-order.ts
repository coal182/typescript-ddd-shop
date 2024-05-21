import {Command} from '@shared/domain/command';

export class CancelOrderCommand extends Command {
    constructor(public id: string) {
        super();
    }
}
