import { Criteria } from '@shared/domain/criteria/Criteria';
import { Nullable } from '@shared/domain/Nullable';

import { Product } from './product';
import { ProductId } from './product-id';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  search(id: ProductId): Promise<Nullable<Product>>;
  searchAll(): Promise<Array<Product>>;
  matching(criteria: Criteria): Promise<Array<Product>>;
}
