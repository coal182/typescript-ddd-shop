import {Primitives} from '@domain/value-objects/primitives-type';
import {ProductResponse} from '@shop-backend/product/application/product-response';

import {Order} from '../domain/order';
import {OrderAddress} from '../domain/order-address';

export interface OrderResponse {
    id: string;
    userId: string;
    status: string;
    name: string;
    address: Primitives<OrderAddress>;
    total: number;
    lines: Array<{productId: string; qty: number; price: number; product?: ProductResponse}>;
}

export class OrdersResponse {
    public readonly orders: ReadonlyArray<OrderResponse>;

    constructor(orders: ReadonlyArray<Order>) {
        this.orders = orders.map((order) => {
            const primitives = order.toPrimitives();
            return {
                id: primitives.id,
                userId: primitives.userId,
                status: primitives.status,
                name: primitives.name,
                address: primitives.address,
                total: primitives.total,
                lines: primitives.lines,
            };
        });
    }
}
