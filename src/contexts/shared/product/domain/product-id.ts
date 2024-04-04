import { Uuid } from '@shared/domain/value-objects/uuid';

export class ProductId extends Uuid {
  public constructor(value: string) {
    super(value);
  }
  static initialize(): ProductId {
    return new ProductId(this.random().toString());
  }
}
