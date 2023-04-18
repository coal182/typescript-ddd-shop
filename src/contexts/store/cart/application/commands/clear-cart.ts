import { Command } from '@core/command';

export class ClearCartCommand extends Command {
  public static commandName = ClearCartCommand.name;

  constructor(guid: string, public readonly originalVersion: number) {
    super(guid);
    this.originalVersion = originalVersion;
  }
}
