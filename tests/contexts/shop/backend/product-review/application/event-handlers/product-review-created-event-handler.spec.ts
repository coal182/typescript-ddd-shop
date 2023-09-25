import { SinonFakeTimers, createSandbox } from 'sinon';

import { ProductReviewCreatedEventHandler } from '@shop-backend/product-review/application/event-handlers/product-review-created-event-handler';

import { ProductReviewRepositoryMock } from '../../__mocks__/product-review-repository-mock';
import { ProductReviewCreatedDomainEventMother } from '../../domain/product-review-created-domain-event-mother';
import { ProductReviewMother } from '../../domain/product-review-mother';
import { CreateProductReviewCommandMother } from '../command-handlers/create-product-review-command-mother';

describe(ProductReviewCreatedEventHandler.name, () => {
  const sandbox = createSandbox();
  let repository: ProductReviewRepositoryMock;
  let handler: ProductReviewCreatedEventHandler;
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date());
    repository = new ProductReviewRepositoryMock();
    handler = new ProductReviewCreatedEventHandler(repository);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  it('should project a valid product on repository', async () => {
    const command = CreateProductReviewCommandMother.random();
    const product = ProductReviewMother.from(command);
    const event = ProductReviewCreatedDomainEventMother.fromProductReview(product);
    await handler.on(event);
    repository.assertSaveHaveBeenCalledWith(product);
  });
});
