import 'reflect-metadata';

import { SinonFakeTimers, createSandbox } from 'sinon';

import { ProductCreator } from '@shop-backend/product/application/create/product-creator';
import { ProductDescriptionChanged } from '@shop-backend/product/domain/events/product-description-changed';
import { Product } from '@shop-backend/product/domain/product';
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
  const sandbox = createSandbox();
  let clock: SinonFakeTimers;
  let eventStore: ProductEventStoreMock;
  let creator: ProductCreator;
  let eventBus: EventBusMock;
  let handler: CreateProductCommandHandler;
  let updateHandler: UpdateProductDescriptionCommandHandler;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date());
    eventStore = new ProductEventStoreMock();
    eventBus = new EventBusMock();
    creator = new ProductCreator(eventBus, eventStore);
    handler = new CreateProductCommandHandler(creator);
    updateHandler = new UpdateProductDescriptionCommandHandler(eventBus, eventStore);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('when a product exists', () => {
    let product: Product;

    beforeEach(async () => {
      product = await givenAProductExists();
    });

    describe('and asked to update his description', () => {
      it('should save the two events on event store', async () => {
        const updatedDescription = ProductDescriptionMother.random();
        const domainEvents = [
          ProductCreatedDomainEventMother.fromProduct(product),
          new ProductDescriptionChanged({
            aggregateId: product.getId(),
            description: updatedDescription.value,
          }),
        ];
        const updateCommand = new UpdateProductDescriptionCommand(product.getId(), updatedDescription.value);
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
