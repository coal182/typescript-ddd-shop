import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {provideMockStore} from '@ngrx/store/testing';
import {AlertDialogComponent} from 'src/app/alert-dialog/alert-dialog.component';
import {CartService} from 'src/app/cart/services/cart.service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {singleProductInitialState} from 'src/app/store/products/state/model';
import {MockCartService} from 'src/app/test/mock-cart-service';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';

import {ProductDetailsComponent} from './product-details.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProductDetailsComponent', () => {
    let component: ProductDetailsComponent;
    let fixture: ComponentFixture<ProductDetailsComponent>;
    const mockActivatedRoute = {
        snapshot: {
            paramMap: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                get: (id: number): string => 'LE9G8_jAwMSjb2FZ0k5wE',
            },
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [ProductDetailsComponent, AlertDialogComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatDialogModule],
    providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatDialog, useValue: {} },
        { provide: CartService, useClass: MockCartService },
        { provide: StorageService, useClass: MockStorageService },
        provideMockStore({ initialState: singleProductInitialState }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
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
