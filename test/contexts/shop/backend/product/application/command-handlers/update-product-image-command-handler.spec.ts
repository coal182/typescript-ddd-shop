import 'reflect-metadata';

import { expect } from 'chai';

import { ProductCreator } from '@storeback/product/application/create/product-creator';
import { ProductCreated } from '@storeback/product/domain/events/product-created';
import { ProductImageChanged } from '@storeback/product/domain/events/product-image-changed';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { UpdateProductImageCommandHandler } from 'src/contexts/shop/product/application/command-handlers/update-product-image-command-handler';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';
import { UpdateProductImageCommand } from 'src/contexts/shop/product/application/commands/update-product-image';
import EventBusMock from 'test/contexts/shared/domain/event-bus-mock';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductImageMother } from '../../domain/product-image-mother';
import { ProductMother } from '../../domain/product-mother';

describe(UpdateProductImageCommandHandler.name, () => {
  let eventStore: ProductEventStoreMock;
  let creator: ProductCreator;
  let eventBus: EventBusMock;
  let handler: CreateProductCommandHandler;
  let updateHandler: UpdateProductImageCommandHandler;

  beforeEach(() => {
    eventStore = new ProductEventStoreMock();
    eventBus = new EventBusMock();
    creator = new ProductCreator(eventBus, eventStore);
    handler = new CreateProductCommandHandler(creator);
    updateHandler = new UpdateProductImageCommandHandler(eventBus, eventStore);
  });
  describe('when a product exists', () => {
    const expectedAggregateRoot = ProductMother.random();
    const updatedImage = ProductImageMother.random();
    const expectedNewDomainEvents = [
      new ProductCreated({
        aggregateId: expectedAggregateRoot.id.value,
        name: expectedAggregateRoot.name.value,
        description: expectedAggregateRoot.description.value,
        image: expectedAggregateRoot.image.value,
        price: expectedAggregateRoot.price.value,
      }),
      new ProductImageChanged({
        aggregateId: expectedAggregateRoot.id.value,
        image: expectedAggregateRoot.image.value,
      }),
    ];

    before(() => {
      const command = new CreateProductCommand(
        expectedAggregateRoot.id.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.description.value,
        expectedAggregateRoot.image.value,
        expectedAggregateRoot.price.value
      );

      handler.handle(command);
    });

    describe('and asked to update his image', () => {
      before(() => {
        const updateCommand = new UpdateProductImageCommand(expectedAggregateRoot.id.value, updatedImage.value);
        updateHandler.handle(updateCommand);
      });

      it('should save the two events on event store', () => {
        eventStore.assertSaveHaveBeenCalledWith(expectedNewDomainEvents);
      });

      it('should be capable to get the aggregate from the events on event store', async () => {
        const savedAggregateDomainEvents = await eventStore.findByAggregateId(expectedAggregateRoot.id);
        expect(savedAggregateDomainEvents).to.deep.equal(expectedNewDomainEvents);
      });
    });
  });
});
