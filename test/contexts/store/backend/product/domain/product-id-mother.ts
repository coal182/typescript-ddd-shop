import { ProductId } from '@storeback/product/domain/product-id';
import { UuidMother } from 'test/contexts/shared/uuid-mother';

export class ProductIdMother {
  static create(value: string): ProductId {
    return new ProductId(value);
  }

  static creator() {
    return () => ProductIdMother.random();
  }

  static random(): ProductId {
    return this.create(UuidMother.random());
  }
}
