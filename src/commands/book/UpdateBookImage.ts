import { Command } from '@core/Command';

export class UpdateBookImageCommand extends Command {
  constructor(public readonly guid: string, public readonly image: string, public readonly originalVersion: number) {
    super(guid);
  }
}
