import { v4 as uuidv4 } from 'uuid';

import { ICommand } from './i-command';

export abstract class Command implements ICommand {
  public id: string;

  constructor(id?: string) {
    this.id = id || uuidv4();
  }
}
