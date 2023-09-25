import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';

import { Criteria } from '@shared/domain/criteria/criteria';
import { ProductReview } from '@shop-backend/product-review/domain/product-review';
import { ProductReviewRepository } from '@shop-backend/product-review/domain/product-review-repository';

export class ProductReviewRepositoryMock implements ProductReviewRepository {
  private saveMock: SinonStub;
  private searchMock: SinonStub;
  private searchAllMock: SinonStub;
  private matchingMock: SinonStub;
  private productReviews: Array<ProductReview> = [];

  constructor() {
    this.saveMock = stub();
    this.searchMock = stub();
    this.searchAllMock = stub();
    this.matchingMock = stub();
  }

  returnOnSearch(products: Array<ProductReview>) {
    this.productReviews = products;
  }

  returnOnSearchAll(products: Array<ProductReview>) {
    this.productReviews = products;
  }

  returnMatching(products: Array<ProductReview>) {
    this.productReviews = products;
  }

  async save(product: ProductReview): Promise<void> {
    this.saveMock(product);
  }

  assertSaveHaveBeenCalledWith(expected: ProductReview): void {
    expect(this.saveMock).to.have.been.calledWith(expected);
  }

  async search(): Promise<ProductReview> {
    this.searchMock();
    return this.productReviews[0];
  }

  assertSearch() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async searchAll(): Promise<ProductReview[]> {
    this.searchAllMock();
    return this.productReviews;
  }

  assertSearchAll() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async matching(criteria: Criteria): Promise<ProductReview[]> {
    this.matchingMock(criteria);
    return this.productReviews;
  }

  assertMatchingHasBeenCalledWith(criteria: Criteria) {
    expect(this.matchingMock).to.have.been.calledWith(criteria);
  }
}
