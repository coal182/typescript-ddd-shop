import {IdProvider} from '@domain/id-provider';
import {Primitives} from '@domain/value-objects/primitives-type';
import {AggregateRoot} from '@shared/domain/aggregate-root';
import {DomainEvent} from '@shared/domain/domain-event';

import {OrderCancelled} from './events/order-cancelled';
import {OrderCreated} from './events/order-created';
import {OrderInitiated} from './events/order-initiated';
import {OrderLineAdded} from './events/order-line-added';
import {OrderAddress} from './order-address';
import {OrderCity} from './order-city';
import {OrderId} from './order-id';
import {OrderLine} from './order-line';
import {OrderName} from './order-name';
import {OrderStatus, OrderStatusEnum} from './order-status';
import {OrderStreet} from './order-street';
import {OrderTotal} from './order-total';
import {OrderUser} from './order-user';

export interface OrderPrimitives {
    id: string;
    userId: string;
    status: string;
    name: string;
    address: Primitives<OrderAddress>;
    total: number;
    lines: Array<Primitives<OrderLine>>;
}

export interface OrderModel {
    id: OrderId;
    userId: OrderUser;
    status: OrderStatus;
    name: OrderName;
    address: OrderAddress;
    total: OrderTotal;
    lines: Array<OrderLine>;
}

export class Order extends AggregateRoot {
    private userId: OrderUser;
    private status: OrderStatus;
    private name: OrderName;
    private address: OrderAddress;
    private total: OrderTotal;
    private lines: Array<OrderLine>;

    constructor(id: OrderId, userId: OrderUser, status: OrderStatus, name: OrderName, address: OrderAddress, total: OrderTotal, lines: Array<OrderLine>) {
        super();
        this.id = id;
        this.userId = userId;
        this.status = status;
        this.name = name;
        this.address = address;
        this.total = total;
        this.lines = lines;
    }

    static create(
        id: OrderId,
        userId: OrderUser,
        status: OrderStatus,
        name: OrderName,
        address: OrderAddress,
        total: OrderTotal,
        lines: Array<OrderLine>,
    ): Order {
        const order = new Order(id, userId, status, name, address, total, lines);

        order.record(
            new OrderInitiated({
                aggregateId: order.id.value,
                userId: order.userId.value,
                status: order.status.value,
                name: order.name.value,
                address: order.address.toPrimitives(),
                total: total.value,
            }),
        );

        return order;
    }

    static initialize(id: OrderId): Order {
        const userId = new OrderUser(IdProvider.getId());
        const status = new OrderStatus(OrderStatusEnum.Initiated);
        const name = new OrderName('');
        const address = new OrderAddress(new OrderStreet(''), new OrderCity(''), 0);
        const total = new OrderTotal(0);
        const lines: Array<OrderLine> = [];

        return new Order(id, userId, status, name, address, total, lines);
    }

    public getLines(): ReadonlyArray<OrderLine> {
        return this.lines;
    }

    public setLines(lines: Array<OrderLine>): void {
        this.lines = lines;
    }

    public addLine(line: OrderLine): void {
        this.lines.push(line);
        this.record(new OrderLineAdded({aggregateId: this.id.value, line: line}));
    }

    public create(): void {
        this.record(new OrderCreated({aggregateId: this.id.value}));
    }

    public cancel(): void {
        this.record(new OrderCancelled({aggregateId: this.id.value}));
    }

    applyOrderInitiated(event: OrderInitiated): void {
        this.id = new OrderId(event.aggregateId);
        this.userId = new OrderUser(event.userId);
        this.status = new OrderStatus(OrderStatusEnum.Initiated);
        this.name = new OrderName(event.name);
        this.address = new OrderAddress(new OrderStreet(event.address.street), new OrderCity(event.address.city), event.address.number);
        this.total = new OrderTotal(event.total);
        this.lines = [];
    }

    applyOrderLineAdded(event: OrderLineAdded): void {
        this.lines.push(event.line);
    }

    applyOrderCreated(event: OrderCreated): void {
        this.id = new OrderId(event.aggregateId);
        this.status = new OrderStatus(OrderStatusEnum.Created);
    }

    applyOrderCanceled(event: OrderCancelled): void {
        this.id = new OrderId(event.aggregateId);
        this.status = new OrderStatus(OrderStatusEnum.Cancelled);
    }

    static fromPrimitives(plainData: OrderPrimitives): Order {
        return new Order(
            new OrderId(plainData.id),
            new OrderUser(plainData.userId),
            new OrderStatus(plainData.status),
            new OrderName(plainData.name),
            new OrderAddress(new OrderStreet(plainData.address.street), new OrderCity(plainData.address.city), plainData.address.number),
            new OrderTotal(plainData.total),
            plainData.lines.map((line) => new OrderLine(line.productId, line.qty, line.price, line.product)),
        );
    }

    toPrimitives(): OrderPrimitives {
        return {
            id: this.id.value,
            userId: this.userId.value,
            status: this.status.value,
            name: this.name.value,
            address: this.address.toPrimitives(),
            total: this.total.value,
            lines: this.lines,
        };
    }

    applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            case 'order.initiated':
                this.applyOrderInitiated(event as OrderInitiated);
                break;
            case 'order.line_added':
                this.applyOrderLineAdded(event as OrderLineAdded);
                break;
            case 'order.created':
                this.applyOrderCreated(event as OrderCreated);
                break;
            case 'order.cancelled':
                this.applyOrderCanceled(event as OrderCancelled);
                break;
            default:
                throw new Error(`Unsupported event: ${event.eventName}`);
        }
    }
}
