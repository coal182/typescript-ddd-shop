import { Command } from '@core/Command';

export class UpdateUserCommand extends Command {
  constructor(
    public readonly guid: string,
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly dateOfBirth: Date,
    public readonly originalVersion: number
  ) {
    super(guid);
  }
}
