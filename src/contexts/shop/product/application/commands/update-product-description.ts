import { Command } from '@shared/domain/Command';

export class UpdateProductDescriptionCommand extends Command {
  constructor(public readonly id: string, public readonly description: string) {
    super();
  }
}
