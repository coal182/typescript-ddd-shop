import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {StorageService} from 'src/app/shared/services/storage.service';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';
import {environment} from 'src/environments/environment';

import {HttpOrderService} from './http-order.service';

import {Order} from '../interfaces/orders';

describe(HttpOrderService.name, () => {
    let service: HttpOrderService;
    let httpTestingController: HttpTestingController;
    const userId = 'user-id';
    const orderId = 'order-id';
    const orderId2 = 'order-id-2';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpOrderService, {provide: StorageService, useClass: MockStorageService}],
        });
        service = TestBed.inject(HttpOrderService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('when asked to get an order', () => {
        it('should fetch the specified order through api', () => {
            const mockOrder: Order = getMockedOrders()[0];

            service.getOrder({id: orderId}).subscribe((order) => {
                expect(order).toEqual(mockOrder);
            });

            const req = httpTestingController.expectOne(`${environment.apiUrl}order/${orderId}`);

            expect(req.request.method).toBe('GET');

            req.flush(mockOrder);

            httpTestingController.verify();
        });
    });

    describe('when asked to get orders', () => {
        it('should fetch orders by user id', () => {
            const mockedOrders: ReadonlyArray<Order> = getMockedOrders();

            service.getOrders().subscribe((orders) => {
                expect(orders).toEqual(mockedOrders);
            });

            const req = httpTestingController.expectOne(`${environment.apiUrl}order/user/${userId}`);

            expect(req.request.method).toBe('GET');

            req.flush(mockedOrders);

            httpTestingController.verify();
        });
    });

    function getMockedOrders(): ReadonlyArray<Order> {
        const mockedOrders: ReadonlyArray<Order> = [
            {
                id: orderId,
                userId: 'user-id',
                name: 'John',
                address: 'Downing Street, London',
                items: [
                    {
                        product: {
                            id: 'product-id',
                            name: 'product-name',
                            description: 'product-description',
                            images: ['product-image'],
                            price: 100,
                            brand: 'product-brand',
                            category: 'product-category',
                            ean: 'product-ean',
                        },
                        qty: 1,
                        price: 100,
                    },
                ],
                status: 'COMPLETED',
                total: 100,
            },
            {
                id: orderId2,
                userId: 'user-id',
                name: 'John',
                address: 'Downing Street, London',
                items: [
                    {
                        product: {
                            id: 'product-id-2',
                            name: 'product-name-2',
                            description: 'product-description-2',
                            images: ['product-image-2'],
                            price: 50,
                            brand: 'product-brand-2',
                            category: 'product-category',
                            ean: 'product-ean-2',
                        },
                        qty: 1,
                        price: 50,
                    },
                ],
                status: 'COMPLETED',
                total: 50,
            },
        ];

        return mockedOrders;
    }
});
