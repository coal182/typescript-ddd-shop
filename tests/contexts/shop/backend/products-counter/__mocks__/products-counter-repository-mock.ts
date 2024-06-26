import {Nullable} from '@shared/domain/nullable';
import {ProductsCounter} from '@shop-backend/products-counter/domain/products-counter';
import {ProductsCounterRepository} from '@shop-backend/products-counter/domain/products-counter-repository';
import {expect} from 'chai';
import {stub} from 'sinon';

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

    returnOnSearch(counter: ProductsCounter): void {
        this.productsCounter = counter;
    }

    assertSearch(): void {
        expect(this.mockSearch).to.have.been.called;
    }

    assertNotSave(): void {
        expect(this.mockSave).to.have.callCount(0);
    }

    assertLastProductsCounterSaved(counter: ProductsCounter): void {
        const lastProductsCounter = this.mockSave.lastCall.firstArg as ProductsCounter;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {id: id1, ...counterPrimitives} = counter.toPrimitives();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {id: id2, ...lastSavedPrimitives} = lastProductsCounter.toPrimitives();

        expect(lastProductsCounter).to.be.instanceOf(ProductsCounter);
        expect(lastSavedPrimitives).to.deep.equal(counterPrimitives);
    }
}
