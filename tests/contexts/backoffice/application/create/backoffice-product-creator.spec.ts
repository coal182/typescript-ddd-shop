import { BackofficeProductCreator } from '@backoffice-backend/product/application/create/backoffice-product-creator';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';
import { ProductEventStoreMock } from 'tests/contexts/shop/backend/product/__mocks__/product-event-store-mock';
import { CreateProductCommandMother } from 'tests/contexts/shop/backend/product/application/command-handlers/create-product-command-mother';
import { ProductCreatedDomainEventMother } from 'tests/contexts/shop/backend/product/domain/product-created-domain-event-mother';
import { ProductMother } from 'tests/contexts/shop/backend/product/domain/product-mother';

import { BackofficeProductMother } from '../../domain/backoffice-product-mother';

describe('BackofficeProductCreator', () => {
  it('creates a backoffice product', async () => {
    const command = CreateProductCommandMother.random();
    const backofficeProduct = BackofficeProductMother.from(command);
    const product = ProductMother.from(command);

    const eventStore = new ProductEventStoreMock();
    const eventBus = new EventBusMock();
    const applicationService = new BackofficeProductCreator(eventBus, eventStore);

    const domainEvent = ProductCreatedDomainEventMother.fromProduct(product);

    await applicationService.run({
      id: backofficeProduct.id,
      name: backofficeProduct.name,
      description: backofficeProduct.description,
      image: backofficeProduct.image,
      price: backofficeProduct.price,
      brand: backofficeProduct.brand,
      category: backofficeProduct.category,
      ean: backofficeProduct.ean,
    });

    eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
    eventBus.assertLastPublishedEventIs(domainEvent);
  });
});
