import { SinonFakeTimers, createSandbox } from 'sinon';

import { BackofficeProductCreator } from '@backoffice-backend/product/application/create/backoffice-product-creator';
import { BackofficeProductBrand } from '@backoffice-backend/product/domain/backoffice-product-brand';
import { BackofficeProductCategory } from '@backoffice-backend/product/domain/backoffice-product-category';
import { BackofficeProductDescription } from '@backoffice-backend/product/domain/backoffice-product-description';
import { BackofficeProductEan } from '@backoffice-backend/product/domain/backoffice-product-ean';
import { BackofficeProductImage } from '@backoffice-backend/product/domain/backoffice-product-image';
import { BackofficeProductName } from '@backoffice-backend/product/domain/backoffice-product-name';
import { BackofficeProductPrice } from '@backoffice-backend/product/domain/backoffice-product-price';
import { Uuid } from '@domain/value-objects/uuid';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';
import { ProductEventStoreMock } from 'tests/contexts/shop/backend/product/__mocks__/product-event-store-mock';
import { CreateProductCommandMother } from 'tests/contexts/shop/backend/product/application/command-handlers/create-product-command-mother';
import { ProductCreatedDomainEventMother } from 'tests/contexts/shop/backend/product/domain/product-created-domain-event-mother';
import { ProductMother } from 'tests/contexts/shop/backend/product/domain/product-mother';

import { BackofficeProductMother } from '../../domain/backoffice-product-mother';

const staticId = new Uuid('49327053-06c3-4182-bb03-06c2873d4654');

describe('BackofficeProductCreator', () => {
  const sandbox = createSandbox();
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date());
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  it('creates a backoffice product', async () => {
    const command = CreateProductCommandMother.randomWithId(staticId.value);
    const backofficeProduct = BackofficeProductMother.from(command);
    const product = ProductMother.from(command);

    const eventStore = new ProductEventStoreMock();
    const eventBus = new EventBusMock();
    const applicationService = new BackofficeProductCreator(eventBus, eventStore);

    const domainEvent = ProductCreatedDomainEventMother.fromProduct(product);

    await applicationService.run({
      id: staticId,
      name: new BackofficeProductName(backofficeProduct.toPrimitives().name),
      description: new BackofficeProductDescription(backofficeProduct.toPrimitives().description),
      images: backofficeProduct.toPrimitives().images.map((image) => new BackofficeProductImage(image)),
      price: new BackofficeProductPrice(backofficeProduct.toPrimitives().price),
      brand: new BackofficeProductBrand(backofficeProduct.toPrimitives().brand),
      category: new BackofficeProductCategory(backofficeProduct.toPrimitives().category),
      ean: new BackofficeProductEan(backofficeProduct.toPrimitives().ean),
    });

    eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
    eventBus.assertLastPublishedEventIs(domainEvent);
  });
});
