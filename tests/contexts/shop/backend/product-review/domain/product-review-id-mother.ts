import {ProductReviewId} from 'src/contexts/shop/product-review/domain/product-review-id';
import {UuidMother} from 'tests/contexts/shared/uuid-mother';

export class ProductReviewIdMother {
    static create(value: string): ProductReviewId {
        return new ProductReviewId(value);
    }

    static creator(): () => ProductReviewIdMother {
        return () => ProductReviewIdMother.random();
    }

    static random(): ProductReviewId {
        return this.create(UuidMother.random());
    }
}
