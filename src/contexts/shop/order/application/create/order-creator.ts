import {EventBus} from '@shared/domain/event-bus';
import {OrderAddress} from '@shop-backend/order/domain/order-address';
import {OrderLine} from '@shop-backend/order/domain/order-line';
import {OrderStatus} from '@shop-backend/order/domain/order-status';
import {OrderTotal} from '@shop-backend/order/domain/order-total';
import {OrderUser} from '@shop-backend/order/domain/order-user';
import {Order} from 'src/contexts/shop/order/domain/order';
import {OrderEventStore} from 'src/contexts/shop/order/domain/order-event-store';
import {OrderId} from 'src/contexts/shop/order/domain/order-id';
import {OrderName} from 'src/contexts/shop/order/domain/order-name';

export class OrderCreator {
    constructor(
        private eventBus: EventBus,
        private eventStore: OrderEventStore,
    ) {}

    async run(params: {
        id: OrderId;
        userId: OrderUser;
        status: OrderStatus;
        name: OrderName;
        address: OrderAddress;
        total: OrderTotal;
        lines: Array<OrderLine>;
    }): Promise<void> {
        const order = Order.create(params.id, params.userId, params.status, params.name, params.address, params.total, params.lines);

        const newDomainEvents = order.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
