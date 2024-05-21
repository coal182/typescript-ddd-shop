import {ProductId} from '@shared/product/domain/product-id';
import {UuidMother} from 'tests/contexts/shared/uuid-mother';

export class ProductIdMother {
    static create(value: string): ProductId {
        return new ProductId(value);
    }

    static creator(): () => ProductId {
        return () => ProductIdMother.random();
    }

    static random(): ProductId {
        return this.create(UuidMother.random());
    }
}
