import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { IdProviderService } from 'src/app/shared/services/id-provider.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MockStorageService } from 'src/app/test/mock-local-storage-service';
import { MockNgZone } from 'src/app/test/mock-ng-zone';

import { MockProductReviewsService } from '../../../test/mock-product-reviews.service';
import { AddProductReviewParams, ProductReviewsService } from '../../services/product-reviews.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

import { ProductReviewsComponent } from './product-reviews.component';

describe(ProductReviewsComponent.name, () => {
  const productId = 'product-id';
  const userId = 'user-id';
  let fixture: ComponentFixture<HostTestComponent>;
  let component: HostTestComponent;
  let productReviewsComponent: ProductReviewsComponent;
  let productReviewsService: MockProductReviewsService;
  let storageService: StorageService;

  beforeEach(() => {
    productReviewsService = new MockProductReviewsService();
    storageService = new MockStorageService();
    TestBed.configureTestingModule({
      declarations: [HostTestComponent, ProductReviewsComponent, StarRatingComponent],
      providers: [
        { provide: ProductReviewsService, useValue: productReviewsService },
        { provide: StorageService, useValue: storageService },
        { provide: FormBuilder },
        { provide: NgZone, useClass: MockNgZone },
        {
          provide: IdProviderService,
          useValue: {
            getId: () => {
              'custom-id';
            },
          },
        },
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, TextFieldModule, MatIconModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HostTestComponent);
    component = fixture.componentInstance;
    productReviewsComponent = fixture.debugElement.query(By.directive(ProductReviewsComponent)).componentInstance;
    component.productId = productId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initialize', () => {
    it('should fetch existent reviews by product id', () => {
      productReviewsService.assertGetProductsReviewsHasBeenCalledWith(productId);
    });

    describe('when asked to add a new review', () => {
      const expectedParams: AddProductReviewParams = {
        id: 'review-id',
        productId,
        userId,
        rating: 5,
        comment: 'Good product',
      };

      beforeEach(() => {
        productReviewsComponent.reviewForm.setValue({
          rating: expectedParams.rating,
          comment: expectedParams.comment,
        });
        fixture.debugElement.query(By.css('[data-test="add-review-btn"]')).nativeElement.click();
        fixture.detectChanges();
      });

      it('should call the service to add it', () => {
        productReviewsService.assertAddProductReviewHasBeenCalledWith(expectedParams);
      });
    });
  });

  @Component({
    template: '<app-product-reviews [productId]="productId"></app-product-reviews>',
  })
  class HostTestComponent {
    productId = 'product-id';
  }
});
