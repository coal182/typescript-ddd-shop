import { Command } from '@core/Command';

export class UpdateBookDescriptionCommand extends Command {
  constructor(
    public readonly guid: string,
    public readonly description: string,
    public readonly originalVersion: number
  ) {
    super(guid);
  }
}
