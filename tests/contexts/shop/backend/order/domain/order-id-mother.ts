import {OrderId} from 'src/contexts/shop/order/domain/order-id';
import {UuidMother} from 'tests/contexts/shared/uuid-mother';

export class OrderIdMother {
    static create(value: string): OrderId {
        return new OrderId(value);
    }

    static creator(): () => OrderIdMother {
        return () => OrderIdMother.random();
    }

    static random(): OrderId {
        return this.create(UuidMother.random());
    }
}
