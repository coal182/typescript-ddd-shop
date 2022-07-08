import { Command } from '@core/command';

export class UpdateUserPasswordCommand extends Command {
  constructor(public readonly guid: string, public readonly password: string, public readonly originalVersion: number) {
    super(guid);
  }
}
