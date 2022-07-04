import { InvalidArgumentError } from '../../shared/invalid-argument-error';
import { Uuid } from '../../shared/uuid';

export class BookId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
