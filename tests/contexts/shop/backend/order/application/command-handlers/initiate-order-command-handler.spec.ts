import 'reflect-metadata';

import { OrderCreator } from '@shop-backend/order/application/create/order-creator';
import { OrderInitiated } from '@shop-backend/order/domain/events/order-initiated';
import { OrderStatus, OrderStatusEnum } from '@shop-backend/order/domain/order-status';
import { InitiateOrderCommandHandler } from 'src/contexts/shop/order/application/command-handlers/initiate-order-command-handler';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { OrderEventStoreMock } from '../../__mocks__/order-event-store-mock';
import { OrderMother } from '../../domain/order-mother';

describe(InitiateOrderCommandHandler.name, () => {
  let eventStore: OrderEventStoreMock;
  let creator: OrderCreator;
  let eventBus: EventBusMock;
  let handler: InitiateOrderCommandHandler;

  beforeEach(() => {
    eventStore = new OrderEventStoreMock();
    eventBus = new EventBusMock();
    creator = new OrderCreator(eventBus, eventStore);
    handler = new InitiateOrderCommandHandler(creator);
  });

  describe('when asked to handle a command', () => {
    const order = OrderMother.randomWithStatus(new OrderStatus(OrderStatusEnum.Initiated)).toPrimitives();
    const domainEvent = new OrderInitiated({
      aggregateId: order.id,
      userId: order.userId,
      status: order.status,
      name: order.name,
      address: order.address,
      total: order.total,
    });

    beforeEach(async () => {
      const command = new InitiateOrderCommand(order.id, order.userId, order.name, order.address, order.total);
      await handler.handle(command);
    });

    it('should save the event on event store and publish it', () => {
      eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
      eventBus.assertLastPublishedEventIs(domainEvent);
    });
  });
});
