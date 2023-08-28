import { expect } from 'chai';

import { ProductsByCriteriaSearcher } from '@backoffice-backend/product/application/search-by-criteria/products-by-criteria-searcher';
import { SearchProductsByCriteriaQuery } from '@backoffice-backend/product/application/search-by-criteria/search-products-by-criteria-query';
import { SearchProductsByCriteriaQueryHandler } from '@backoffice-backend/product/application/search-by-criteria/search-products-by-criteria-query-handler';
import { OrderTypes } from '@domain/criteria/order-type';

import { BackofficeProductRepositoryMock } from '../../__mocks__/backoffice-product-repository-mock';
import { BackofficeProductMother } from '../../domain/backoffice-product-mother';
import { SearchProductsByCriteriaResponseMother } from '../../domain/search-products-by-criteria-response-mother';

describe('SearchAllProducts QueryHandler', () => {
  let repository: BackofficeProductRepositoryMock;

  beforeEach(() => {
    repository = new BackofficeProductRepositoryMock();
  });

  it('should find products filter by criteria', async () => {
    const products = [
      BackofficeProductMother.random(),
      BackofficeProductMother.random(),
      BackofficeProductMother.random(),
    ];
    repository.returnMatching(products);

    const handler = new SearchProductsByCriteriaQueryHandler(new ProductsByCriteriaSearcher(repository));

    const filterName: Map<string, string> = new Map([
      ['field', 'name'],
      ['operator', 'CONTAINS'],
      ['value', 'DDD'],
    ]);
    const filterImage: Map<string, string> = new Map([
      ['field', 'image'],
      ['operator', 'CONTAINS'],
      ['value', 'jpg'],
    ]);

    const filters: Array<Map<string, string>> = [filterName, filterImage];

    const query = new SearchProductsByCriteriaQuery(filters);
    const response = await handler.handle(query);

    const expected = SearchProductsByCriteriaResponseMother.create(products);
    repository.assertMatchingHasBeenCalledWith();
    expect(expected).to.deep.equal(response);
  });

  it('should find products filter by criteria with order, limit and offset', async () => {
    const products = [
      BackofficeProductMother.random(),
      BackofficeProductMother.random(),
      BackofficeProductMother.random(),
    ];
    repository.returnMatching(products);

    const handler = new SearchProductsByCriteriaQueryHandler(new ProductsByCriteriaSearcher(repository));

    const filterName: Map<string, string> = new Map([
      ['field', 'name'],
      ['operator', 'CONTAINS'],
      ['value', 'DDD'],
    ]);
    const filterImage: Map<string, string> = new Map([
      ['field', 'image'],
      ['operator', 'CONTAINS'],
      ['value', 'jpg'],
    ]);

    const filters: Array<Map<string, string>> = [filterName, filterImage];
    const orderBy = 'name';
    const orderType = OrderTypes.ASC;

    const query = new SearchProductsByCriteriaQuery(filters, orderBy, orderType, 10, 1);
    const response = await handler.handle(query);

    const expected = SearchProductsByCriteriaResponseMother.create(products);
    repository.assertMatchingHasBeenCalledWith();
    expect(expected).to.deep.equal(response);
  });
});
