import {Command} from '@shared/domain/command';

export class RemoveItemFromCartCommand extends Command {
    constructor(
        public readonly id: string,
        public readonly productId: string,
        public readonly qty: number,
        public readonly price: number,
    ) {
        super();
    }
}
