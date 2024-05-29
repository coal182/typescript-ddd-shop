import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShippingComponent} from './shipping.component';

import {CartService} from '../cart/services/cart.service';
import {StorageService} from '../shared/services/storage.service';
import {MockStorageService} from '../test/mock-local-storage-service';

describe('ShippingComponent', () => {
    let component: ShippingComponent;
    let fixture: ComponentFixture<ShippingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [ShippingComponent],
            providers: [CartService, {provide: StorageService, useClass: MockStorageService}],
            schemas: [NO_ERRORS_SCHEMA],
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
