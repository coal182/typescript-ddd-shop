import {Primitives} from '@domain/value-objects/primitives-type';
import {MongoRepository} from '@infrastructure/persistence/mongo/mongo-repository';
import {Criteria} from '@shared/domain/criteria/criteria';
import {Nullable} from '@shared/domain/nullable';
import {OrderAddress} from '@shop-backend/order/domain/order-address';
import {Order} from 'src/contexts/shop/order/domain/order';
import {OrderId} from 'src/contexts/shop/order/domain/order-id';
import {OrderRepository} from 'src/contexts/shop/order/domain/order-repository';

interface OrderLineDocument {
    productId: string;
    qty: number;
    price: number;
}

interface OrderDocument {
    id: string;
    userId: string;
    status: string;
    name: string;
    address: Primitives<OrderAddress>;
    total: number;
    lines: Array<OrderLineDocument>;
}

export class MongoOrderRepository extends MongoRepository<Order> implements OrderRepository {
    public save(order: Order): Promise<void> {
        return this.persist(order.getId(), order);
    }

    public async search(id: OrderId): Promise<Nullable<Order>> {
        const collection = await this.collection();
        const document = await collection.findOne<OrderDocument>({_id: id.value});

        if (document) {
            const primitivesFromDocument = {
                id: document.id,
                userId: document.userId,
                status: document.status,
                name: document.name,
                address: document.address,
                total: document.total,
                lines: document.lines,
            };
            return document ? Order.fromPrimitives(primitivesFromDocument) : null;
        }

        return null;
    }

    protected collectionName(): string {
        return 'shop_orders';
    }

    public async searchAll(): Promise<Order[]> {
        const collection = await this.collection();
        const documents = await collection.find<OrderDocument>({}, {}).toArray();
        return documents.map((document) => {
            const primitivesFromDocument = {
                id: document.id,
                userId: document.userId,
                status: document.status,
                name: document.name,
                address: document.address,
                total: document.total,
                lines: document.lines,
            };
            return Order.fromPrimitives(primitivesFromDocument);
        });
    }

    public async matching(criteria: Criteria): Promise<Order[]> {
        const documents = await this.searchByCriteria<OrderDocument>(criteria);
        return documents.map((document) => {
            const primitivesFromDocument = {
                id: document.id,
                userId: document.userId,
                status: document.status,
                name: document.name,
                address: document.address,
                total: document.total,
                lines: document.lines,
            };
            return Order.fromPrimitives(primitivesFromDocument);
        });
    }
}
