import {Criteria} from '@shared/domain/criteria/criteria';
import {Nullable} from '@shared/domain/nullable';

import {Product} from './product';

import {ProductId} from '../../../shared/product/domain/product-id';

export interface ProductRepository {
    save(product: Product): Promise<void>;
    search(id: ProductId): Promise<Nullable<Product>>;
    searchAll(): Promise<Array<Product>>;
    matching(criteria: Criteria): Promise<Array<Product>>;
}
