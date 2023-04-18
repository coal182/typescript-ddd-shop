import { Uuid } from '@storeback/shared/value-objects/uuid';

export class CartId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
