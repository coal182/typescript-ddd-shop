import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StorageService} from 'src/app/shared/services/storage.service';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';

import {OrderListComponent} from './order-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('OrderListComponent', () => {
    let component: OrderListComponent;
    let fixture: ComponentFixture<OrderListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    declarations: [OrderListComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [{ provide: StorageService, useClass: MockStorageService }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OrderListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
