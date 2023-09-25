import { BackofficeProductId } from '@backoffice-backend/product/domain/backoffice-product-id';
import { Query } from '@shared/domain/query';

export class SearchProductByIdQuery implements Query {
  readonly id: BackofficeProductId;

  constructor(id: BackofficeProductId) {
    this.id = id;
  }
}
