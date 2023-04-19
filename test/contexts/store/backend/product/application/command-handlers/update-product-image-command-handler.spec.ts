import 'reflect-metadata';

import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateProductCommandHandler } from '@storeback/product/application/command-handlers/create-product-command-handler';
import { UpdateProductImageCommandHandler } from '@storeback/product/application/command-handlers/update-product-image-command-handler';
import { CreateProductCommand } from '@storeback/product/application/commands/create-product';
import { UpdateProductImageCommand } from '@storeback/product/application/commands/update-product-image';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductRepositoryMock } from '../../__mocks__/product-repository-mock';
import { ProductImageMother } from '../../domain/product-image-mother';
import { ProductMother } from '../../domain/product-mother';

describe(UpdateProductImageCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new ProductEventStoreMock();
  const repository = new ProductRepositoryMock(eventStoreMock);
  const commandHandler = new CreateProductCommandHandler(repository);
  const updateCommandHandler = new UpdateProductImageCommandHandler(repository);

  describe('when a product exists', () => {
    const expectedAggregateRoot = ProductMother.random();
    const updatedImage = ProductImageMother.random();

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

    describe('and asked to update his image', () => {
      before(() => {
        const updateCommand = new UpdateProductImageCommand(expectedAggregateRoot.id.value, updatedImage.value);
        updateCommandHandler.handle(updateCommand);
      });

      it('should save the two events on repository', () => {
        repository.assertSaveHasBeenCalledTwice;
      });

      it('should update the image', async () => {
        const savedAggregate = await repository.getById(expectedAggregateRoot.id.value);
        expect(savedAggregate.image.value).not.to.be.equal(expectedAggregateRoot.image);
        expect(savedAggregate.image.value).to.be.equal(updatedImage.value);
      });
    });
  });
});
