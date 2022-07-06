import { Command } from '@core/Command';

export class UpdateBookImageCommand extends Command {
  constructor(public readonly id: string, public readonly image: string, public readonly originalVersion: number) {
    super(id);
  }
}
