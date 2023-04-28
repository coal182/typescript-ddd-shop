import { Command } from '@shared/domain/command';

export class CreateOrderCommand extends Command {
  constructor(public id: string) {
    super();
  }
}
