import {OrderStatus} from 'src/contexts/shop/order/domain/order-status';

export class OrderStatusMother {
    static create(value: string): OrderStatus {
        return new OrderStatus(value);
    }

    static random(): OrderStatus {
        return this.create('created');
    }
}
