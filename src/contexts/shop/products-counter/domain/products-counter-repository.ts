import {Nullable} from '@shared/domain/nullable';

import {ProductsCounter} from './products-counter';

export interface ProductsCounterRepository {
    search(): Promise<Nullable<ProductsCounter>>;
    save(counter: ProductsCounter): Promise<void>;
}
