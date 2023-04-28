import { v4 as uuidv4 } from 'uuid';

import { Command } from '@shared/domain/command';

export class InitiateOrderCommand extends Command {
  constructor(
    public id: string,
    public userId: string,
    public name: string,
    public address: string,
    public total: number
  ) {
    super();
    this.id = id || uuidv4();
  }
}
