import 'reflect-metadata';

import { expect } from 'chai';

import { ProductCreator } from '@storeback/product/application/create/product-creator';
import { ProductCreated } from '@storeback/product/domain/events/product-created';
import { ProductDescriptionChanged } from '@storeback/product/domain/events/product-description-changed';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { UpdateProductDescriptionCommandHandler } from 'src/contexts/shop/product/application/command-handlers/update-product-description-command-handler';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';
import EventBusMock from 'test/contexts/shared/domain/event-bus-mock';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductDescriptionMother } from '../../domain/product-description-mother';
import { ProductMother } from '../../domain/product-mother';

describe(UpdateProductDescriptionCommandHandler.name, () => {
  let eventStore: ProductEventStoreMock;
  let creator: ProductCreator;
  let eventBus: EventBusMock;
  let handler: CreateProductCommandHandler;
  let updateHandler: UpdateProductDescriptionCommandHandler;

  beforeEach(() => {
    eventStore = new ProductEventStoreMock();
    eventBus = new EventBusMock();
    creator = new ProductCreator(eventBus, eventStore);
    handler = new CreateProductCommandHandler(creator);
    updateHandler = new UpdateProductDescriptionCommandHandler(eventBus, eventStore);
  });
  describe('when a product exists', () => {
    const expectedAggregateRoot = ProductMother.random();
    const updatedDescription = ProductDescriptionMother.random();
    const expectedNewDomainEvents = [
      new ProductCreated({
        aggregateId: expectedAggregateRoot.id.value,
        name: expectedAggregateRoot.name.value,
        description: expectedAggregateRoot.description.value,
        image: expectedAggregateRoot.image.value,
        price: expectedAggregateRoot.price.value,
      }),
      new ProductDescriptionChanged({
        aggregateId: expectedAggregateRoot.id.value,
        description: expectedAggregateRoot.description.value,
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

    describe('and asked to update his description', () => {
      before(() => {
        const updateCommand = new UpdateProductDescriptionCommand(
          expectedAggregateRoot.id.value,
          updatedDescription.value
        );
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
