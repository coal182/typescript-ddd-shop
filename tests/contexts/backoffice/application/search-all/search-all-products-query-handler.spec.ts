import { expect } from 'chai';

import { ProductsFinder } from '@backoffice-backend/product/application/search-all/products-finder';
import { SearchAllProductsQuery } from '@backoffice-backend/product/application/search-all/search-all-products-query';
import { SearchAllProductsQueryHandler } from '@backoffice-backend/product/application/search-all/search-all-products-query-handler';

import { BackofficeProductRepositoryMock } from '../../__mocks__/backoffice-product-repository-mock';
import { BackofficeProductMother } from '../../domain/backoffice-product-mother';
import { SearchAllProductsResponseMother } from '../../domain/search-all-products-response-mother';

describe('SearchAllProducts QueryHandler', () => {
  let repository: BackofficeProductRepositoryMock;

  beforeEach(() => {
    repository = new BackofficeProductRepositoryMock();
  });

  it('should find an existing products counter', async () => {
    const products = [
      BackofficeProductMother.random(),
      BackofficeProductMother.random(),
      BackofficeProductMother.random(),
    ];
    repository.returnOnSearchAll(products);

    const handler = new SearchAllProductsQueryHandler(new ProductsFinder(repository));

    const query = new SearchAllProductsQuery();
    const response = await handler.handle(query);

    repository.assertSearchAll();

    const expected = SearchAllProductsResponseMother.create(products);
    expect(expected).to.deep.equal(response);
  });
});
