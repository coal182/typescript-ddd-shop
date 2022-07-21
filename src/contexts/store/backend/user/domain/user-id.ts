import { InvalidArgumentError } from '@shared/value-objects/invalid-argument-error';
import { Uuid } from '@shared/value-objects/uuid';

export class UserId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
