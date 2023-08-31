import Sinon, { SinonFakeTimers, SinonSandbox } from 'sinon';

import { BackofficeProductCreator } from '@backoffice-backend/product/application/create/backoffice-product-creator';
import { Uuid } from '@domain/value-objects/uuid';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';
import { ProductEventStoreMock } from 'tests/contexts/shop/backend/product/__mocks__/product-event-store-mock';
import { CreateProductCommandMother } from 'tests/contexts/shop/backend/product/application/command-handlers/create-product-command-mother';
import { ProductCreatedDomainEventMother } from 'tests/contexts/shop/backend/product/domain/product-created-domain-event-mother';
import { ProductMother } from 'tests/contexts/shop/backend/product/domain/product-mother';

import { BackofficeProductMother } from '../../domain/backoffice-product-mother';

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;
const staticId = new Uuid('49327053-06c3-4182-bb03-06c2873d4654');

describe.only('BackofficeProductCreator', () => {
  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    clock = Sinon.useFakeTimers(new Date());
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
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
      name: backofficeProduct.name,
      description: backofficeProduct.description,
      images: backofficeProduct.images,
      price: backofficeProduct.price,
      brand: backofficeProduct.brand,
      category: backofficeProduct.category,
      ean: backofficeProduct.ean,
    });

    eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
    eventBus.assertLastPublishedEventIs(domainEvent);
  });
});
