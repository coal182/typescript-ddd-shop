import {ProductCreatedEventHandler} from '@shop-backend/product/application/event-handlers/product-created-event-handler';
import {SinonFakeTimers, createSandbox} from 'sinon';
import {CreateProductCommandMother} from 'tests/contexts/backoffice/application/command-handlers/create-product-command-mother';

import {ProductRepositoryMock} from '../../__mocks__/product-repository-mock';
import {ProductCreatedDomainEventMother} from '../../domain/product-created-domain-event-mother';
import {ProductMother} from '../../domain/product-mother';

describe(ProductCreatedEventHandler.name, () => {
    const sandbox = createSandbox();
    let repository: ProductRepositoryMock;
    let handler: ProductCreatedEventHandler;
    let clock: SinonFakeTimers;

    beforeEach(() => {
        clock = sandbox.useFakeTimers(new Date());
        repository = new ProductRepositoryMock();
        handler = new ProductCreatedEventHandler(repository);
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('should project a valid product on repository', async () => {
        const command = CreateProductCommandMother.random();
        const product = ProductMother.from(command);
        const event = ProductCreatedDomainEventMother.fromProduct(product);
        await handler.on(event);
        repository.assertSaveHaveBeenCalledWith(product);
    });
});
