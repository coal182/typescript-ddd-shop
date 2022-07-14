import { v4 as uuidv4 } from 'uuid';

import { ICommand } from './i-command';

export abstract class Command implements ICommand {
  public guid: string;

  constructor(guid?: string) {
    this.guid = guid || uuidv4();
  }
}
