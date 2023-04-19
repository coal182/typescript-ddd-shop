import 'reflect-metadata';

import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { UpdateProductDescriptionCommandHandler } from 'src/contexts/shop/product/application/command-handlers/update-product-description-command-handler';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductRepositoryMock } from '../../__mocks__/product-repository-mock';
import { ProductDescriptionMother } from '../../domain/product-description-mother';
import { ProductMother } from '../../domain/product-mother';

describe(UpdateProductDescriptionCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new ProductEventStoreMock();
  const repository = new ProductRepositoryMock(eventStoreMock);
  const commandHandler = new CreateProductCommandHandler(repository);
  const updateCommandHandler = new UpdateProductDescriptionCommandHandler(repository);

  describe('when a product exists', () => {
    const expectedAggregateRoot = ProductMother.random();
    const updatedDescription = ProductDescriptionMother.random();

    before(() => {
      const command = new CreateProductCommand(
        expectedAggregateRoot.id.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.description.value,
        expectedAggregateRoot.image.value,
        expectedAggregateRoot.price.value
      );

      commandHandler.handle(command);
    });

    describe('and asked to update his description', () => {
      before(() => {
        const updateCommand = new UpdateProductDescriptionCommand(
          expectedAggregateRoot.id.value,
          updatedDescription.value
        );
        updateCommandHandler.handle(updateCommand);
      });

      it('should save the two events on repository', () => {
        repository.assertSaveHasBeenCalledTwice;
      });

      it('should update the description', async () => {
        const savedAggregate = await repository.getById(expectedAggregateRoot.id.value);
        expect(savedAggregate.description.value).not.to.be.equal(expectedAggregateRoot.description);
        expect(savedAggregate.description.value).to.be.equal(updatedDescription.value);
      });
    });
  });
});
