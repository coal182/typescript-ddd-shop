import { expect } from 'chai';
import { stub } from 'sinon';

import { Nullable } from '@shared/domain/nullable';
import { ProductsCounter } from '@storeback/products-counter/domain/products-counter';
import { ProductsCounterRepository } from '@storeback/products-counter/domain/products-counter-repository';

export class ProductsCounterRepositoryMock implements ProductsCounterRepository {
  private mockSave = stub();
  private mockSearch = stub();
  private productsCounter: Nullable<ProductsCounter> = null;

  async search(): Promise<Nullable<ProductsCounter>> {
    this.mockSearch();
    return this.productsCounter;
  }

  async save(counter: ProductsCounter): Promise<void> {
    this.mockSave(counter);
  }

  returnOnSearch(counter: ProductsCounter) {
    this.productsCounter = counter;
  }

  assertSearch() {
    expect(this.mockSearch).to.have.been.called;
  }

  assertNotSave() {
    expect(this.mockSave).to.have.callCount(0);
  }

  assertLastProductsCounterSaved(counter: ProductsCounter) {
    const lastProductsCounter = this.mockSave.lastCall.firstArg as ProductsCounter;
    const { id: id1, ...counterPrimitives } = counter.toPrimitives();
    const { id: id2, ...lastSavedPrimitives } = lastProductsCounter.toPrimitives();

    expect(lastProductsCounter).to.be.instanceOf(ProductsCounter);
    expect(lastSavedPrimitives).to.deep.equal(counterPrimitives);
  }
}
