import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';

import { Criteria } from '@shared/domain/criteria/criteria';
import { Product } from '@shop-backend/product/domain/product';
import { ProductRepository } from '@shop-backend/product/domain/product-repository';

export class ProductRepositoryMock implements ProductRepository {
  private saveMock: SinonStub;
  private searchMock: SinonStub;
  private searchAllMock: SinonStub;
  private matchingMock: SinonStub;
  private products: Array<Product> = [];

  constructor() {
    this.saveMock = stub();
    this.searchMock = stub();
    this.searchAllMock = stub();
    this.matchingMock = stub();
  }

  returnOnSearch(products: Array<Product>) {
    this.products = products;
  }

  returnOnSearchAll(products: Array<Product>) {
    this.products = products;
  }

  returnMatching(products: Array<Product>) {
    this.products = products;
  }

  async save(product: Product): Promise<void> {
    this.saveMock(product);
  }

  assertSaveHaveBeenCalledWith(expected: Product): void {
    expect(this.saveMock).to.have.been.calledWith(expected);
  }

  async search(): Promise<Product> {
    this.searchMock();
    return this.products[0];
  }

  assertSearch() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async searchAll(): Promise<Product[]> {
    this.searchAllMock();
    return this.products;
  }

  assertSearchAll() {
    expect(this.searchAllMock).to.have.been.called;
  }

  async matching(criteria: Criteria): Promise<Product[]> {
    this.matchingMock(criteria);
    return this.products;
  }

  assertMatchingHasBeenCalledWith(criteria: Criteria) {
    expect(this.matchingMock).to.have.been.calledWith(criteria);
  }
}
