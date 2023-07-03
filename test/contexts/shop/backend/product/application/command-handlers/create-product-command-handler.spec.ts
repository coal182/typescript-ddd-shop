import { expect } from 'chai';

import { ProductCreator } from '@storeback/product/application/create/product-creator';
import { ProductNameLengthExceeded } from '@storeback/product/domain/product-name-length-exceeded';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import EventBusMock from 'test/contexts/shared/domain/event-bus-mock';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductCreatedDomainEventMother } from '../../domain/product-created-domain-event-mother';
import { ProductMother } from '../../domain/product-mother';

import { CreateProductCommandMother } from './create-product-command-mother';

describe(CreateProductCommandHandler.name, () => {
  let eventStore: ProductEventStoreMock;
  let creator: ProductCreator;
  let eventBus: EventBusMock;
  let handler: CreateProductCommandHandler;

  beforeEach(() => {
    eventStore = new ProductEventStoreMock();
    eventBus = new EventBusMock();
    creator = new ProductCreator(eventBus, eventStore);
    handler = new CreateProductCommandHandler(creator);
  });

  describe('when asked to handle a command', () => {
    const command = CreateProductCommandMother.random();
    const product = ProductMother.from(command);
    const domainEvent = ProductCreatedDomainEventMother.fromProduct(product);

    it('should save the event on event store and publish it', async () => {
      await handler.handle(command);

      eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
      eventBus.assertLastPublishedEventIs(domainEvent);
    });

    describe('given that the product name length is exceeded', () => {
      it('should throw error', async () => {
        expect(() => {
          const invalidCommand = CreateProductCommandMother.invalid();
          const invalidProduct = ProductMother.from(invalidCommand);
          const invalidDomainEvent = ProductCreatedDomainEventMother.fromProduct(invalidProduct);

          handler.handle(invalidCommand);

          eventStore.assertSaveHaveBeenCalledWith([invalidDomainEvent]);
        }).to.throw(ProductNameLengthExceeded);
      });
    });
  });
});
