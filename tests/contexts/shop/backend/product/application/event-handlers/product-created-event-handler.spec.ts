import { ProductCreatedEventHandler } from '@shop-backend/product/application/event-handlers/product-created-event-handler';

import { ProductRepositoryMock } from '../../__mocks__/product-repository-mock';
import { ProductCreatedDomainEventMother } from '../../domain/product-created-domain-event-mother';
import { ProductMother } from '../../domain/product-mother';
import { CreateProductCommandMother } from '../command-handlers/create-product-command-mother';

let repository: ProductRepositoryMock;
let handler: ProductCreatedEventHandler;

beforeEach(() => {
  repository = new ProductRepositoryMock();
  handler = new ProductCreatedEventHandler(repository);
});

describe(ProductCreatedEventHandler.name, () => {
  const command = CreateProductCommandMother.random();
  const product = ProductMother.from(command);
  const event = ProductCreatedDomainEventMother.fromProduct(product);
  it('should project a valid product on repository', async () => {
    await handler.on(event);
    repository.assertSaveHaveBeenCalledWith(product);
  });
});
