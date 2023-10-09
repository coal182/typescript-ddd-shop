import { expect } from 'chai';

import { ProductsFinder } from '@backoffice-backend/product/application/search-all/products-finder';
import { SearchAllProductsQuery } from '@backoffice-backend/product/application/search-all/search-all-products-query';
import { SearchAllProductsQueryHandler } from '@backoffice-backend/product/application/search-all/search-all-products-query-handler';

import { ProductRepositoryMock } from '../../__mocks__/product-repository-mock';
import { ProductMother } from '../../domain/product-mother';
import { SearchAllProductsResponseMother } from '../../domain/search-all-products-response-mother';

describe('SearchAllProducts QueryHandler', () => {
  let repository: ProductRepositoryMock;

  beforeEach(() => {
    repository = new ProductRepositoryMock();
  });

  it('should find an existing products counter', async () => {
    const products = [ProductMother.random(), ProductMother.random(), ProductMother.random()];
    repository.returnOnSearchAll(products);

    const handler = new SearchAllProductsQueryHandler(new ProductsFinder(repository));

    const query = new SearchAllProductsQuery();
    const response = await handler.handle(query);

    repository.assertSearchAll();

    const expected = SearchAllProductsResponseMother.create(products);
    expect(expected).to.deep.equal(response);
  });
});
