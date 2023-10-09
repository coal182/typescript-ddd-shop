import { Command } from '@shared/domain/command';

export class UpdateProductDescriptionCommand extends Command {
  constructor(public readonly id: string, public readonly description: string) {
    super();
  }
}
