import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';

import { BackofficeProduct } from './backoffice-product';
import { BackofficeProductId } from './backoffice-product-id';

export interface BackofficeProductRepository {
  save(product: BackofficeProduct): Promise<void>;
  search(id: BackofficeProductId): Promise<Nullable<BackofficeProduct>>;
  searchAll(): Promise<Array<BackofficeProduct>>;
  matching(criteria: Criteria): Promise<Array<BackofficeProduct>>;
}
