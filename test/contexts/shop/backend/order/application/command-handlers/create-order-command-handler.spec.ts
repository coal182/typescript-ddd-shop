import { expect } from 'chai';

import { OrderCreated } from '@storeback/order/domain/events/order-created';
import { CreateOrderCommandHandler } from 'src/contexts/shop/order/application/command-handlers/create-order-command-handler';
import { CreateOrderCommand } from 'src/contexts/shop/order/application/commands/create-order';
import EventBusMock from 'test/contexts/shared/domain/event-bus-mock';

import { OrderEventStoreMock } from '../../__mocks__/order-event-store-mock';
import { OrderMother } from '../../domain/order-mother';

describe(CreateOrderCommandHandler.name, () => {
  let eventStore: OrderEventStoreMock;
  let eventBus: EventBusMock;
  let handler: CreateOrderCommandHandler;

  beforeEach(() => {
    eventStore = new OrderEventStoreMock();
    eventBus = new EventBusMock();
    handler = new CreateOrderCommandHandler(eventBus, eventStore);
  });

  describe('when asked to handle a command', () => {
    const expectedAggregateRoot = OrderMother.random();
    const expectedNewDomainEvent = new OrderCreated({
      aggregateId: expectedAggregateRoot.id.value,
    });

    beforeEach(() => {
      const command = new CreateOrderCommand(expectedAggregateRoot.id.value);
      handler.handle(command);
    });

    it('should save the event on repository', () => {
      eventStore.assertSaveHaveBeenCalledWith([expectedNewDomainEvent]);
    });

    it('should be capable to get the aggregate from the events on event store', async () => {
      const savedAggregateDomainEvents = await eventStore.findByAggregateId(expectedAggregateRoot.id);
      expect(savedAggregateDomainEvents).to.deep.equal([expectedNewDomainEvent]);
    });
  });
});
