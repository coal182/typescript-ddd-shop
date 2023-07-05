import 'reflect-metadata';

import { UpdateProductImageCommand } from '@storeback/product/application/commands/update-product-image';
import { ProductCreator } from '@storeback/product/application/create/product-creator';
import { ProductCreated } from '@storeback/product/domain/events/product-created';
import { ProductImageChanged } from '@storeback/product/domain/events/product-image-changed';
import { CreateProductCommandHandler } from 'src/contexts/shop/product/application/command-handlers/create-product-command-handler';
import { UpdateProductImageCommandHandler } from 'src/contexts/shop/product/application/command-handlers/update-product-image-command-handler';
import { CreateProductCommand } from 'src/contexts/shop/product/application/commands/create-product';
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
    const product = ProductMother.random();
    const updatedImage = ProductImageMother.random();
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
      new ProductImageChanged({
        aggregateId: product.id.value,
        image: updatedImage.value,
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

    describe('and asked to update his image', () => {
      beforeEach(async () => {
        const updateCommand = new UpdateProductImageCommand(product.id.value, updatedImage.value);
        await updateHandler.handle(updateCommand);
      });

      it('should save the two events on event store', () => {
        eventStore.assertSaveHaveBeenCalledWith(domainEvents);
      });
    });
  });
});
