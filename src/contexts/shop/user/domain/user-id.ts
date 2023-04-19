import { Uuid } from '@shared/domain/value-objects/uuid';

export class UserId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
