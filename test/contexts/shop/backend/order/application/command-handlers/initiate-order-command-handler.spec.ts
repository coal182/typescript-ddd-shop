import 'reflect-metadata';

import { IEventStore } from '@core/i-event-store';
import { InitiateOrderCommandHandler } from 'src/contexts/shop/order/application/command-handlers/initiate-order-command-handler';
import { InitiateOrderCommand } from 'src/contexts/shop/order/application/commands/initiate-order';
import { Order } from 'src/contexts/shop/order/domain/order';

import { OrderEventStoreMock } from '../../__mocks__/order-event-store-mock';
import { OrderRepositoryMock } from '../../__mocks__/order-repository-mock';
import { OrderMother } from '../../domain/order-mother';

describe(InitiateOrderCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new OrderEventStoreMock();
  const repository = new OrderRepositoryMock(eventStoreMock);
  const commandHandler = new InitiateOrderCommandHandler(repository);

  describe('when asked to handle a command', () => {
    const expectedAggregateRoot = OrderMother.random();

    beforeEach(() => {
      const command = new InitiateOrderCommand(
        expectedAggregateRoot.guid.value,
        expectedAggregateRoot.userId.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.address.value,
        expectedAggregateRoot.total.value
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
