import 'reflect-metadata';

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
    const product = ProductMother.random();
    const updatedDescription = ProductDescriptionMother.random();
    const domainEvents = [
      new ProductCreated({
        aggregateId: product.id.value,
        name: product.name.value,
        description: product.description.value,
        image: product.image.value,
        price: product.price.value,
        brand: product.brand.value,
        category: product.category.value,
        ean: product.ean.value,
      }),
      new ProductDescriptionChanged({
        aggregateId: product.id.value,
        description: updatedDescription.value,
      }),
    ];

    const command = new CreateProductCommand(
      product.id.value,
      product.name.value,
      product.description.value,
      product.image.value,
      product.price.value,
      product.brand.value,
      product.category.value,
      product.ean.value
    );

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
