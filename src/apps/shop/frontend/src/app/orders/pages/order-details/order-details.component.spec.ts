import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StorageService } from 'src/app/shared/services/storage.service';
import { MockStorageService } from 'src/app/test/mock-local-storage-service';

import { HttpOrderService } from '../../services/http-order.service';

import { OrderDetailsComponent } from './order-details.component';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        HttpOrderService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: () => of([{ orderId: 1 }]) },
            },
          },
        },
        { provide: StorageService, useClass: MockStorageService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
