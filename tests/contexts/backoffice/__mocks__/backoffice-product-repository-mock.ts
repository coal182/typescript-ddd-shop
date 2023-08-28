import { expect } from 'chai';
import { stub } from 'sinon';

import { BackofficeProduct } from '@backoffice-backend/product/domain/backoffice-product';
import { BackofficeProductId } from '@backoffice-backend/product/domain/backoffice-product-id';
import { BackofficeProductRepository } from '@backoffice-backend/product/domain/backoffice-product-repository';
import { Criteria } from '@domain/criteria/criteria';
import { Nullable } from '@domain/nullable';

export class BackofficeProductRepositoryMock implements BackofficeProductRepository {
  private mockSearchAll = stub();
  private mockSearch = stub();
  private mockSave = stub();
  private mockMatching = stub();
  private products: Array<BackofficeProduct> = [];

  returnOnSearchAll(products: Array<BackofficeProduct>) {
    this.products = products;
  }

  returnOnSearch(product: BackofficeProduct) {
    this.products = [product];
  }

  returnMatching(products: Array<BackofficeProduct>) {
    this.products = products;
  }

  async searchAll(): Promise<BackofficeProduct[]> {
    this.mockSearchAll();
    return this.products;
  }

  assertSearchAll() {
    expect(this.mockSearchAll).to.have.been.called;
  }

  async search(id: BackofficeProductId): Promise<Nullable<BackofficeProduct>> {
    this.mockSearch(id);
    return this.products[0];
  }

  async save(product: BackofficeProduct): Promise<void> {
    this.mockSave(product);
  }

  assertSaveHasBeenCalledWith(product: BackofficeProduct) {
    expect(this.mockSave).to.have.been.calledWith(product);
  }

  async matching(criteria: Criteria): Promise<BackofficeProduct[]> {
    this.mockMatching(criteria);
    return this.products;
  }

  assertMatchingHasBeenCalledWith() {
    expect(this.mockMatching).to.have.been.called;
  }
}
