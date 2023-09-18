import 'reflect-metadata';

import { SinonFakeTimers, createSandbox } from 'sinon';

import { UpdateProductImageCommand } from '@shop-backend/product/application/commands/update-product-image';
import { ProductCreator } from '@shop-backend/product/application/create/product-creator';
import { ProductImageChanged } from '@shop-backend/product/domain/events/product-image-changed';
import { Product } from '@shop-backend/product/domain/product';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { UpdateProductImageCommandHandler } from 'src/contexts/shop/product/application/command-handlers/update-product-image-command-handler';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { ProductEventStoreMock } from '../../__mocks__/product-event-store-mock';
import { ProductCreatedDomainEventMother } from '../../domain/product-created-domain-event-mother';
import { ProductImageMother } from '../../domain/product-image-mother';
import { ProductMother } from '../../domain/product-mother';

import { CreateProductCommandMother } from './create-product-command-mother';

describe(UpdateProductImageCommandHandler.name, () => {
  const sandbox = createSandbox();
  let clock: SinonFakeTimers;
  let eventStore: ProductEventStoreMock;
  let creator: ProductCreator;
  let eventBus: EventBusMock;
  let handler: CreateProductCommandHandler;
  let updateHandler: UpdateProductImageCommandHandler;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date('2023-01-01T00:00:00.000Z'));
    eventStore = new ProductEventStoreMock();
    eventBus = new EventBusMock();
    creator = new ProductCreator(eventBus, eventStore);
    handler = new CreateProductCommandHandler(creator);
    updateHandler = new UpdateProductImageCommandHandler(eventBus, eventStore);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('given a product exists', () => {
    let product: Product;

    beforeEach(async () => {
      product = await givenAProductExists();
    });

    describe('and asked to update his image', () => {
      it('should save the two events on event store', async () => {
        const updatedImage = ProductImageMother.random();

        const domainEvents = [
          ProductCreatedDomainEventMother.fromProduct(product),
          new ProductImageChanged({
            aggregateId: product.getId(),
            images: [updatedImage.value],
          }),
        ];
        const updateCommand = new UpdateProductImageCommand(product.getId(), [updatedImage.value]);
        await updateHandler.handle(updateCommand);
        eventStore.assertSaveHaveBeenCalledWith(domainEvents);
      });
    });
  });

  async function givenAProductExists(): Promise<Product> {
    const command = CreateProductCommandMother.random();
    const product = ProductMother.from(command);
    await handler.handle(command);
    return product;
  }
});
