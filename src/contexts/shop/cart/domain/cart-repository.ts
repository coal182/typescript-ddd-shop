import {Criteria} from '@shared/domain/criteria/criteria';
import {Nullable} from '@shared/domain/nullable';

import {Cart} from './cart';
import {CartId} from './cart-id';

export interface CartRepository {
    save(cart: Cart): Promise<void>;
    search(id: CartId): Promise<Nullable<Cart>>;
    searchAll(): Promise<Array<Cart>>;
    matching(criteria: Criteria): Promise<Array<Cart>>;
}
