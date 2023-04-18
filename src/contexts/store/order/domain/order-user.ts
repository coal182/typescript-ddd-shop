import { Uuid } from '@storeback/shared/value-objects/uuid';

export class OrderUser extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
