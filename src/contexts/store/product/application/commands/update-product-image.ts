import { Command } from '@shared/domain/Command';

export class UpdateProductImageCommand extends Command {
  constructor(public readonly id: string, public readonly image: string) {
    super();
  }
}
