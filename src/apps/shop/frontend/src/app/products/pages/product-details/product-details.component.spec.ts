import {provideHttpClientTesting} from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {provideMockStore} from '@ngrx/store/testing';
import {CartService} from 'src/app/cart/services/cart.service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {singleProductInitialState} from 'src/app/store/products/state/model';
import {MockCartService} from 'src/app/test/mock-cart-service';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';

import {ProductDetailsComponent} from './product-details.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

describe('ProductDetailsComponent', () => {
    let component: ProductDetailsComponent;
    let fixture: ComponentFixture<ProductDetailsComponent>;
    const mockActivatedRoute = {
        snapshot: {
            paramMap: {
                get: (id: number): string => 'LE9G8_jAwMSjb2FZ0k5wE',
            },
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductDetailsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: CartService, useClass: MockCartService},
                {provide: StorageService, useClass: MockStorageService},
                provideMockStore({initialState: singleProductInitialState}),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
