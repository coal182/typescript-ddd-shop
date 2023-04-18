import { Command } from '@core/command';

export class UpdateBookAuthorCommand extends Command {
  constructor(public readonly id: string, public readonly author: string, public readonly originalVersion: number) {
    super(id);
  }
}
