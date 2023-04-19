import 'reflect-metadata';

import { IEventStore } from '@core/i-event-store';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';
import { Product } from 'src/contexts/shop/product/domain/product';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductRepositoryMock } from '../../__mocks__/product-repository-mock';
import { ProductMother } from '../../domain/product-mother';

describe(CreateProductCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new ProductEventStoreMock();
  const repository = new ProductRepositoryMock(eventStoreMock);
  const commandHandler = new CreateProductCommandHandler(repository);

  describe('when asked to handle a command', () => {
    const expectedAggregateRoot = ProductMother.random();

    beforeEach(() => {
      const command = new CreateProductCommand(
        expectedAggregateRoot.id.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.description.value,
        expectedAggregateRoot.image.value,
        expectedAggregateRoot.price.value
      );
      commandHandler.handle(command);
    });

    it('should save the event on repository', () => {
      const expectedVersion = -1;
      repository.assertSaveHasBeenCalledWith(expectedAggregateRoot, expectedVersion);
    });

    it('should be capable to get the aggregate from the events on event store', async () => {
      const savedAggregate = await repository.getById(expectedAggregateRoot.id.value);
      const savedProduct = (({ id, name, description, image, price }) => ({
        id,
        name,
        description,
        image,
        price,
      }))(savedAggregate);
      const expectedProduct = (({ id, name, description, image, price }) => ({
        id,
        name,
        description,
        image,
        price,
      }))(expectedAggregateRoot);
      repository.assertSavedAggregate<Product>(savedAggregate, savedProduct, expectedProduct);
    });
  });
});
