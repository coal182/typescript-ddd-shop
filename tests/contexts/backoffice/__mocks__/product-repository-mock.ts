import { expect } from 'chai';
import { stub } from 'sinon';

import { Product } from '@backoffice-backend/product/domain/product';
import { ProductRepository } from '@backoffice-backend/product/domain/product-repository';
import { Criteria } from '@domain/criteria/criteria';
import { Nullable } from '@domain/nullable';
import { ProductId } from '@shared/product/domain/product-id';

export class ProductRepositoryMock implements ProductRepository {
  private mockSearchAll = stub();
  private mockSearch = stub();
  private mockSave = stub();
  private mockMatching = stub();
  private products: Array<Product> = [];

  returnOnSearchAll(products: Array<Product>) {
    this.products = products;
  }

  returnOnSearch(product: Product) {
    this.products = [product];
  }

  returnMatching(products: Array<Product>) {
    this.products = products;
  }

  async searchAll(): Promise<Product[]> {
    this.mockSearchAll();
    return this.products;
  }

  assertSearchAll() {
    expect(this.mockSearchAll).to.have.been.called;
  }

  async search(id: ProductId): Promise<Nullable<Product>> {
    this.mockSearch(id);
    return this.products[0];
  }

  async save(product: Product): Promise<void> {
    this.mockSave(product);
  }

  assertSaveHasBeenCalledWith(product: Product) {
    expect(this.mockSave).to.have.been.calledWith(product);
  }

  async matching(criteria: Criteria): Promise<Product[]> {
    this.mockMatching(criteria);
    return this.products;
  }

  assertMatchingHasBeenCalledWith() {
    expect(this.mockMatching).to.have.been.called;
  }
}
