import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShippingComponent} from './shipping.component';

import {CartService} from '../cart/services/cart.service';
import {StorageService} from '../shared/services/storage.service';
import {MockStorageService} from '../test/mock-local-storage-service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ShippingComponent', () => {
    let component: ShippingComponent;
    let fixture: ComponentFixture<ShippingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [ShippingComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [CartService, { provide: StorageService, useClass: MockStorageService }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShippingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
