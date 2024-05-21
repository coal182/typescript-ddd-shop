import {ProductCreator} from '@backoffice-backend/product/application/create/product-creator';
import {Uuid} from '@domain/value-objects/uuid';
import {ProductBrand} from '@shared/product/domain/product-brand';
import {ProductCategory} from '@shared/product/domain/product-category';
import {ProductDescription} from '@shared/product/domain/product-description';
import {ProductEan} from '@shared/product/domain/product-ean';
import {ProductImage} from '@shared/product/domain/product-image';
import {ProductName} from '@shared/product/domain/product-name';
import {ProductPrice} from '@shared/product/domain/product-price';
import {SinonFakeTimers, createSandbox} from 'sinon';
import {CreateProductCommandMother} from 'tests/contexts/backoffice/application/command-handlers/create-product-command-mother';
import {ProductMother} from 'tests/contexts/backoffice/domain/product-mother';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import {ProductEventStoreMock} from '../../__mocks__/product-event-store-mock';
import {ProductCreatedDomainEventMother} from '../../domain/product-created-domain-event-mother';

const staticId = new Uuid('49327053-06c3-4182-bb03-06c2873d4654');

describe('ProductCreator', () => {
    const sandbox = createSandbox();
    let clock: SinonFakeTimers;

    beforeEach(() => {
        clock = sandbox.useFakeTimers(new Date());
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('creates a backoffice product', async () => {
        const command = CreateProductCommandMother.randomWithId(staticId.value);
        const product = ProductMother.from(command);

        const eventStore = new ProductEventStoreMock();
        const eventBus = new EventBusMock();
        const applicationService = new ProductCreator(eventBus, eventStore);

        const domainEvent = ProductCreatedDomainEventMother.fromProduct(product);

        await applicationService.run({
            id: staticId,
            name: new ProductName(product.toPrimitives().name),
            description: new ProductDescription(product.toPrimitives().description),
            images: product.toPrimitives().images.map((image) => new ProductImage(image)),
            price: new ProductPrice(product.toPrimitives().price),
            brand: new ProductBrand(product.toPrimitives().brand),
            category: new ProductCategory(product.toPrimitives().category),
            ean: new ProductEan(product.toPrimitives().ean),
        });

        eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
        eventBus.assertLastPublishedEventIs(domainEvent);
    });
});
