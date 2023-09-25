import { expect } from 'chai';
import { SinonFakeTimers, createSandbox } from 'sinon';

import { CreateProductCommand } from '@shop-backend/product/application/commands/create-product';
import { ProductCreator } from '@shop-backend/product/application/create/product-creator';
import { ProductCreated } from '@shop-backend/product/domain/events/product-created';
import { Product } from '@shop-backend/product/domain/product';
import { ProductNameLengthExceeded } from '@shop-backend/product/domain/product-name-length-exceeded';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductCreatedDomainEventMother } from '../../domain/product-created-domain-event-mother';
import { ProductMother } from '../../domain/product-mother';

import { CreateProductCommandMother } from './create-product-command-mother';

describe(CreateProductCommandHandler.name, () => {
  const sandbox = createSandbox();
  let clock: SinonFakeTimers;
  let eventStore: ProductEventStoreMock;
  let creator: ProductCreator;
  let eventBus: EventBusMock;
  let handler: CreateProductCommandHandler;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date());
    eventStore = new ProductEventStoreMock();
    eventBus = new EventBusMock();
    creator = new ProductCreator(eventBus, eventStore);
    handler = new CreateProductCommandHandler(creator);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('when asked to handle a command', () => {
    let command: CreateProductCommand;
    let product: Product;
    let domainEvent: ProductCreated;

    beforeEach(() => {
      command = CreateProductCommandMother.random();
      product = ProductMother.from(command);
      domainEvent = ProductCreatedDomainEventMother.fromProduct(product);
    });

    it('should save the event on event store and publish it', async () => {
      await handler.handle(command);
      eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
      eventBus.assertLastPublishedEventIs(domainEvent);
    });

    it('should throw error if the product name length is exceeded', async () => {
      const invalidCommand = CreateProductCommandMother.invalid();
      await expect(handler.handle(invalidCommand)).to.eventually.be.rejectedWith(ProductNameLengthExceeded);
    });
  });
});
