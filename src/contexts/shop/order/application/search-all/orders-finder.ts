import {Order} from '@shop-backend/order/domain/order';

import {OrderRepository} from '../../domain/order-repository';

export class OrdersFinder {
    constructor(private orderRepository: OrderRepository) {}

    async run(): Promise<ReadonlyArray<Order>> {
        const orders = await this.orderRepository.searchAll();

        return orders;
    }
}
