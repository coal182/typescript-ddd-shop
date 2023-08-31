import { InitiateOrderCommandHandler } from '@shop-backend/order/application/command-handlers/initiate-order-command-handler';
import { InitiateOrderCommand } from '@shop-backend/order/application/commands/initiate-order';
import { OrderCreator } from '@shop-backend/order/application/create/order-creator';
import { OrderCreated } from '@shop-backend/order/domain/events/order-created';
import { OrderInitiated } from '@shop-backend/order/domain/events/order-initiated';
import { OrderStatus, OrderStatusEnum } from '@shop-backend/order/domain/order-status';
import { CreateOrderCommandHandler } from 'src/contexts/shop/order/application/command-handlers/create-order-command-handler';
import { CreateOrderCommand } from 'src/contexts/shop/order/application/commands/create-order';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { OrderEventStoreMock } from '../../__mocks__/order-event-store-mock';
import { OrderMother } from '../../domain/order-mother';

describe(CreateOrderCommandHandler.name, () => {
  let eventStore: OrderEventStoreMock;
  let eventBus: EventBusMock;
  let creator: OrderCreator;
  let handler: InitiateOrderCommandHandler;
  let createHandler: CreateOrderCommandHandler;

  beforeEach(() => {
    eventStore = new OrderEventStoreMock();
    eventBus = new EventBusMock();
    creator = new OrderCreator(eventBus, eventStore);
    handler = new InitiateOrderCommandHandler(creator);
    createHandler = new CreateOrderCommandHandler(eventBus, eventStore);
  });

  describe('when asked to handle a command', () => {
    const order = OrderMother.randomWithStatus(new OrderStatus(OrderStatusEnum.Initiated));

    const domainEvents = [
      new OrderInitiated({
        aggregateId: order.id.value,
        userId: order.userId.value,
        status: order.status.value,
        name: order.name.value,
        address: order.address.toPrimitives(),
        total: order.total.value,
      }),
      new OrderCreated({
        aggregateId: order.id.value,
      }),
    ];

    beforeEach(async () => {
      const command = new InitiateOrderCommand(
        order.id.value,
        order.userId.value,
        order.name.value,
        order.address.toPrimitives(),
        order.total.value
      );
      await handler.handle(command);
    });

    it('should save the event on event store and publish it', async () => {
      const createCommand = new CreateOrderCommand(order.id.value);

      await createHandler.handle(createCommand);

      eventStore.assertSaveHaveBeenCalledWith(domainEvents);
      eventBus.assertLastPublishedEventIs(domainEvents[1]);
    });
  });
});
