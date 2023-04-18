import { Uuid } from '@storeback/shared/value-objects/uuid';

export class UserId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
