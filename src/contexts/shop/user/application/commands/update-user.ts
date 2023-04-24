import { Command } from '@shared/domain/command';

export class UpdateUserCommand extends Command {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly dateOfBirth: Date
  ) {
    super();
  }
}
