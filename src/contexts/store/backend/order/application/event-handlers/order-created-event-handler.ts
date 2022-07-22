import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/application-error';
import { EventDescriptor, IEventDescriptor } from '@core/event-descriptor';
import { IEventHandler } from '@core/i-event-handler';
import { OrderCreated } from '@storeback/order/domain/events/order-created';
import { Order } from '@storeback/order/domain/order';

@injectable()
export class OrderCreatedEventHandler implements IEventHandler<OrderCreated> {
  public event: string = OrderCreated.name;
  Type: any;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  // Circular Dependency OrderRepository: OrderCreatedEventHandler -> OrderRepository -> OrderEventStore -> EventBus -> EventHandlers[] -> OrderCreatedEventHandler

  async handle(event: OrderCreated) {
    console.log(
      '🚀 ~ file: order-created-event-handler.ts ~ line 18 ~ OrderCreatedEventHandler ~ handle ~ event',
      event
    );

    const order = new Order();
    const events = (await this.db
      .collection('order-events')
      .find({ aggregateGuid: event.guid })
      .toArray()) as IEventDescriptor[];
    if (!events.length) {
      throw new NotFoundException('Aggregate with the requested Guid does not exist');
    }
    const history = events.map((eventDescriptor: EventDescriptor) => {
      return eventDescriptor.data;
    });
    order.loadFromHistory(history);

    await this.db.collection('orders').insertOne({
      id: order.guid.value,
      userId: order.userId.value,
      status: order.status.value,
      name: order.name.value,
      address: order.address.value,
      total: order.total.value,
      items: order.lines,
      version: order.version,
    });
  }
}
