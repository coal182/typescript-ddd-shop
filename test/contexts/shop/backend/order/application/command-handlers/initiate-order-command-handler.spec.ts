import 'reflect-metadata';

import { expect } from 'chai';

import { OrderCreator } from '@storeback/order/application/create/order-creator';
import { OrderInitiated } from '@storeback/order/domain/events/order-initiated';
import { InitiateOrderCommandHandler } from 'src/contexts/shop/order/application/command-handlers/initiate-order-command-handler';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';
import EventBusMock from 'test/contexts/shared/domain/event-bus-mock';

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
    const expectedAggregateRoot = OrderMother.random();
    const expectedNewDomainEvent = new OrderInitiated({
      aggregateId: expectedAggregateRoot.id.value,
      userId: expectedAggregateRoot.userId.value,
      status: expectedAggregateRoot.status.value,
      name: expectedAggregateRoot.name.value,
      address: expectedAggregateRoot.address.value,
      total: expectedAggregateRoot.total.value,
    });

    beforeEach(() => {
      const command = new InitiateOrderCommand(
        expectedAggregateRoot.id.value,
        expectedAggregateRoot.userId.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.address.value,
        expectedAggregateRoot.total.value
      );
      handler.handle(command);
    });

    it('should save the event on event store and publish it', () => {
      eventStore.assertSaveHaveBeenCalledWith([expectedNewDomainEvent]);
      eventBus.assertLastPublishedEventIs(expectedNewDomainEvent);
    });

    it('should be capable to get the aggregate from the events on event store', async () => {
      const savedAggregateDomainEvents = await eventStore.findByAggregateId(expectedAggregateRoot.id);
      expect(savedAggregateDomainEvents).to.deep.equal([expectedNewDomainEvent]);
    });
  });
});
