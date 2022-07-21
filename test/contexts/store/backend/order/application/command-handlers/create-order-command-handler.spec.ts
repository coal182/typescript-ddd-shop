import 'reflect-metadata';
import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateOrderCommandHandler } from '@storeback/order/application/command-handlers/create-order-command-handler';
import { CreateOrderCommand } from '@storeback/order/application/commands/create-order';
import { Order } from '@storeback/order/domain/order';

import { OrderEventStoreMock } from '../../__mocks__/order-event-store-mock';
import { OrderRepositoryMock } from '../../__mocks__/order-repository-mock';
import { OrderMother } from '../../domain/order-mother';

describe(CreateOrderCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new OrderEventStoreMock();
  const repository = new OrderRepositoryMock(eventStoreMock);
  const commandHandler = new CreateOrderCommandHandler(repository);

  describe('when asked to handle a command', () => {
    const expectedAggregateRoot = OrderMother.random();

    beforeEach(() => {
      const command = new CreateOrderCommand(
        expectedAggregateRoot.guid.value,
        expectedAggregateRoot.status.value,
        expectedAggregateRoot.version
      );
      commandHandler.handle(command);
    });

    it('should save the event on repository', () => {
      const expectedVersion = -1;
      repository.assertSaveHasBeenCalledWith(expectedAggregateRoot, expectedVersion);
    });

    it('should be capable to get the aggregate from the events on event store', async () => {
      const savedAggregate = await repository.getById(expectedAggregateRoot.guid.value);
      const savedOrder = (({ guid, userId, status, name, address, total }) => ({
        guid,
        userId,
        status,
        name,
        address,
        total,
      }))(savedAggregate);
      const expectedOrder = (({ guid, userId, status, name, address, total }) => ({
        guid,
        userId,
        status,
        name,
        address,
        total,
      }))(expectedAggregateRoot);
      repository.assertSavedAggregate<Order>(savedAggregate, savedOrder, expectedOrder);
    });
  });
});
