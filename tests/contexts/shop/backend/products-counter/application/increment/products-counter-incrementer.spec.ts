import { ProductsCounterIncrementer } from '@shop-backend/products-counter/application/increment/products-counter-incrementer';
import { ProductsCounter } from '@shop-backend/products-counter/domain/products-counter';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { ProductIdMother } from '../../../product/domain/product-id-mother';
import { ProductsCounterRepositoryMock } from '../../__mocks__/products-counter-repository-mock';
import { ProductsCounterIncrementedDomainEventMother } from '../../domain/products-counter-incremented-domain-event-mother';
import { ProductsCounterMother } from '../../domain/products-counter-mother';

describe('ProductsCounter Incrementer', () => {
  let incrementer: ProductsCounterIncrementer;
  let eventBus: EventBusMock;
  let repository: ProductsCounterRepositoryMock;

  beforeEach(() => {
    eventBus = new EventBusMock();
    repository = new ProductsCounterRepositoryMock();
    incrementer = new ProductsCounterIncrementer(repository, eventBus);
  });

  it('should initialize a new counter', async () => {
    const productId = ProductIdMother.random();
    const counter = ProductsCounterMother.withOne(productId);

    await incrementer.run(productId);

    repository.assertLastProductsCounterSaved(counter);
  });

  it('should increment an existing counter', async () => {
    const existingCounter = ProductsCounterMother.random();
    repository.returnOnSearch(existingCounter);
    const productId = ProductIdMother.random();
    const expected = ProductsCounter.fromPrimitives(existingCounter.toPrimitives());
    expected.increment(productId);
    const expectedEvent = ProductsCounterIncrementedDomainEventMother.fromProductCounter(expected);

    await incrementer.run(productId);

    repository.assertLastProductsCounterSaved(expected);
    eventBus.assertLastPublishedEventIs(expectedEvent);
  });

  it('should not increment an already incremented counter', async () => {
    const existingCounter = ProductsCounterMother.random();
    repository.returnOnSearch(existingCounter);
    const productId = existingCounter.existingProducts[0];

    await incrementer.run(productId);

    repository.assertNotSave();
  });
});
