import { Command } from '@shared/domain/command';

export class UpdateUserPasswordCommand extends Command {
  constructor(public readonly id: string, public readonly password: string) {
    super();
  }
}
