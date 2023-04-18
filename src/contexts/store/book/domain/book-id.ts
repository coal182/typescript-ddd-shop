import { Uuid } from '@shared/value-objects/uuid';

export class BookId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
