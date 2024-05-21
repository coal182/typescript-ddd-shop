import {OrderName} from 'src/contexts/shop/order/domain/order-name';
import {WordMother} from 'tests/contexts/shared/word-mother';

export class OrderNameMother {
    static create(value: string): OrderName {
        return new OrderName(value);
    }

    static random(): OrderName {
        return this.create(WordMother.random());
    }
}
