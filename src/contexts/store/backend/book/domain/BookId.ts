import { InvalidArgumentError } from '@shared/valueObjects/invalid-argument-error';
import { Uuid } from '@shared/valueObjects/uuid';

export class BookId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
