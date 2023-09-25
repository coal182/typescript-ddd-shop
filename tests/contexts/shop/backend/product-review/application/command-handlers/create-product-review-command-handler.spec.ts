import { expect } from 'chai';
import Sinon, { SinonFakeTimers, createSandbox } from 'sinon';

import { ProductFinder } from '@shop-backend/product/application/search-by-id/product-finder';
import { CreateProductReviewCommand } from '@shop-backend/product-review/application/commands/create-product-review';
import { ProductReviewCreator } from '@shop-backend/product-review/application/create/product-review-creator';
import { ProductReviewCreated } from '@shop-backend/product-review/domain/events/product-review-created';
import { ProductReview } from '@shop-backend/product-review/domain/product-review';
import { ProductReviewRatingNotValid } from '@shop-backend/product-review/domain/product-review-rating-not-valid';
import { CreateProductReviewCommandHandler } from 'src/contexts/shop/product-review/application/command-handlers/create-product-review-command-handler';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { ProductReviewEventStoreMock } from '../../__mocks__/product-review-event-store-mock';
import { ProductReviewCreatedDomainEventMother } from '../../domain/product-review-created-domain-event-mother';
import { ProductReviewMother } from '../../domain/product-review-mother';

import { CreateProductReviewCommandMother } from './create-product-review-command-mother';

describe(CreateProductReviewCommandHandler.name, () => {
  const sandbox = createSandbox();
  let clock: SinonFakeTimers;
  let eventStore: ProductReviewEventStoreMock;
  let creator: ProductReviewCreator;
  let eventBus: EventBusMock;
  let productFinder: ProductFinder;
  let handler: CreateProductReviewCommandHandler;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date());
    eventStore = new ProductReviewEventStoreMock();
    eventBus = new EventBusMock();
    productFinder = Sinon.createStubInstance(ProductFinder);
    creator = new ProductReviewCreator(eventBus, eventStore, productFinder);
    handler = new CreateProductReviewCommandHandler(creator);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('when asked to handle a command', () => {
    let command: CreateProductReviewCommand;
    let productReview: ProductReview;
    let domainEvent: ProductReviewCreated;

    beforeEach(() => {
      command = CreateProductReviewCommandMother.random();
      productReview = ProductReviewMother.from(command);
      domainEvent = ProductReviewCreatedDomainEventMother.fromProductReview(productReview);
    });

    it('should save the event on event store and publish it', async () => {
      await handler.handle(command);
      eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
      eventBus.assertLastPublishedEventIs(domainEvent);
    });

    it('should throw error if the product review rating is out of range', async () => {
      const invalidCommand = CreateProductReviewCommandMother.invalidRating();
      await expect(handler.handle(invalidCommand)).to.eventually.be.rejectedWith(ProductReviewRatingNotValid);
    });
  });
});
