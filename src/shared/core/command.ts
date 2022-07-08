import { nanoid } from 'nanoid';

import { ICommand } from './i-command';

export abstract class Command implements ICommand {
  public guid: string;

  constructor(guid?: string) {
    this.guid = guid || nanoid();
  }
}
