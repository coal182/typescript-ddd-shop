import { Uuid } from '@shared/domain/value-objects/uuid';

export class OrderUser extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
