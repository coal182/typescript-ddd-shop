import {IdProvider} from '@domain/id-provider';
import {Primitives} from '@domain/value-objects/primitives-type';
import {Command} from '@shared/domain/command';
import {OrderAddress} from '@shop-backend/order/domain/order-address';

export class InitiateOrderCommand extends Command {
    constructor(
        public id: string,
        public userId: string,
        public name: string,
        public address: Primitives<OrderAddress>,
        public total: number,
    ) {
        super();
        this.id = id || IdProvider.getId();
    }
}
