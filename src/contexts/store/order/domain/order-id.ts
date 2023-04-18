import { Uuid } from '@storeback/shared/value-objects/uuid';

export class OrderId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
