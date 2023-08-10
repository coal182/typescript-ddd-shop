import { expect } from 'chai';

import { FindProductsCounterQuery } from '@storeback/products-counter/application/find/find-products-counter-query';
import { FindProductsCounterQueryHandler } from '@storeback/products-counter/application/find/find-products-counter-query-handler';
import { ProductsCounterFinder } from '@storeback/products-counter/application/find/products-counter-finder';
import { ProductsCounterNotExist } from '@storeback/products-counter/domain/products-counter-not-exist';

import { ProductsCounterRepositoryMock } from '../../__mocks__/products-counter-repository-mock';
import { ProductsCounterMother } from '../../domain/products-counter-mother';

describe('FindProductsCounterQueryHandler', () => {
  let repository: ProductsCounterRepositoryMock;

  beforeEach(() => {
    repository = new ProductsCounterRepositoryMock();
  });

  it('should find an existing courses counter', async () => {
    const counter = ProductsCounterMother.random();
    repository.returnOnSearch(counter);
    const finder = new ProductsCounterFinder(repository);
    const handler = new FindProductsCounterQueryHandler(finder);

    const response = await handler.handle(new FindProductsCounterQuery());

    repository.assertSearch();
    expect(counter.total.value).to.be.equal(response.total);
  });

  it('should throw an exception when courses counter does not exists', async () => {
    const finder = new ProductsCounterFinder(repository);
    const handler = new FindProductsCounterQueryHandler(finder);

    await expect(handler.handle(new FindProductsCounterQuery())).rejectedWith(ProductsCounterNotExist);
  });
});
