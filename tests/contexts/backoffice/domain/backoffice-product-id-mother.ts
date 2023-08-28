import { BackofficeProductId } from '@backoffice-backend/product/domain/backoffice-product-id';
import { UuidMother } from 'tests/contexts/shared/uuid-mother';

export class BackofficeProductIdMother {
  static create(value: string): BackofficeProductId {
    return new BackofficeProductId(value);
  }

  static creator() {
    return () => BackofficeProductIdMother.random();
  }

  static random(): BackofficeProductId {
    return this.create(UuidMother.random());
  }
}
