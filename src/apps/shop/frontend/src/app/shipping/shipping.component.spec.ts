import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartService } from '../cart/services/cart.service';
import { StorageService } from '../shared/services/storage.service';
import { MockStorageService } from '../test/mock-local-storage-service';

import { ShippingComponent } from './shipping.component';

describe('ShippingComponent', () => {
  let component: ShippingComponent;
  let fixture: ComponentFixture<ShippingComponent>;
  let httpMock: HttpClientTestingModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShippingComponent],
      providers: [CartService, { provide: StorageService, useClass: MockStorageService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingComponent);
    component = fixture.componentInstance;
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
