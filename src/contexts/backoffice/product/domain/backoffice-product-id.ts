import { Uuid } from '@shared/domain/value-objects/uuid';

export class BackofficeProductId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
}
