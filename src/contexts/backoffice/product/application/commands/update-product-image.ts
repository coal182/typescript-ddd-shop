import {Command} from '@shared/domain/command';

export class UpdateProductImageCommand extends Command {
    constructor(
        public readonly id: string,
        public readonly images: string[],
    ) {
        super();
    }
}
