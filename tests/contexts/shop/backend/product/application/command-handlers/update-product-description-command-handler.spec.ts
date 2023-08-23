import 'reflect-metadata';

import { ProductCreator } from '@shop-backend/product/application/create/product-creator';
import { ProductDescriptionChanged } from '@shop-backend/product/domain/events/product-description-changed';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { UpdateProductDescriptionCommandHandler } from 'src/contexts/shop/product/application/command-handlers/update-product-description-command-handler';
import { UpdateProductDescriptionCommand } from 'src/contexts/shop/product/application/commands/update-product-description';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductCreatedDomainEventMother } from '../../domain/product-created-domain-event-mother';
import { ProductDescriptionMother } from '../../domain/product-description-mother';
import { ProductMother } from '../../domain/product-mother';

import { CreateProductCommandMother } from './create-product-command-mother';

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
    const command = CreateProductCommandMother.random();
    const product = ProductMother.from(command);
    const updatedDescription = ProductDescriptionMother.random();
    const domainEvents = [
      ProductCreatedDomainEventMother.fromProduct(product),
      new ProductDescriptionChanged({
        aggregateId: product.id.value,
        description: updatedDescription.value,
      }),
    ];

    beforeEach(async () => {
      await handler.handle(command);
    });

    describe('and asked to update his description', () => {
      beforeEach(async () => {
        const updateCommand = new UpdateProductDescriptionCommand(product.id.value, updatedDescription.value);
        await updateHandler.handle(updateCommand);
      });

      it('should save the two events on event store', () => {
        eventStore.assertSaveHaveBeenCalledWith(domainEvents);
      });
    });
  });
});
