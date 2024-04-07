import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

import { IdProviderService } from 'src/app/shared/services/id-provider.service';
import { PopupService } from 'src/app/shared/services/popup/popup-service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MockStorageService } from 'src/app/test/mock-local-storage-service';
import { MockNgZone } from 'src/app/test/mock-ng-zone';

import { MockProductReviewsService } from '../../../test/mock-product-reviews.service';
import { ProductReviewBody, ProductReviewsService } from '../../services/product-reviews.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

import { ProductReviewsComponent } from './product-reviews.component';

fdescribe(ProductReviewsComponent.name, () => {
  const productId = 'product-id';
  const userId = 'user-id';
  const otherUserId = 'other-user-id';
  let fixture: ComponentFixture<HostTestComponent>;
  let hostComponent: HostTestComponent;
  let component: ProductReviewsComponent;
  let productReviewsService: MockProductReviewsService;
  let storageService: StorageService;
  let popupServiceSpy: jasmine.SpyObj<PopupService>;

  describe('when initialize', () => {
    describe('and there is already a current user review', () => {
      beforeEach(async () => {
        initTestingModule(userId);
        await initComponent(productId);
      });

      it('should fetch existent reviews by product id', () => {
        productReviewsService.assertGetHasBeenCalledWith(productId);
      });

      it('should not show the form', () => {
        const saveBtn = fixture.debugElement.query(By.css('[data-test="save-review-btn"]'));
        expect(saveBtn).toBeNull();
      });
      // describe('when click on edit review', () => {
      //   fixture.debugElement.query(By.css('[data-test="edit-review-btn"]')).nativeElement.click();
      // });
    });

    describe('and there is not a current user review', () => {
      beforeEach(async () => {
        initTestingModule(otherUserId);
        await initComponent(productId);
      });

      it('should fetch existent reviews by product id', () => {
        productReviewsService.assertGetHasBeenCalledWith(productId);
      });

      describe('when asked to add a new review', () => {
        const expectedBody: ProductReviewBody = {
          id: 'review-id',
          productId,
          userId,
          rating: 5,
          comment: 'Good product',
        };

        beforeEach(() => {
          component.reviewForm.setValue({
            id: null,
            rating: expectedBody.rating,
            comment: expectedBody.comment,
          });
          fixture.debugElement.query(By.css('[data-test="save-review-btn"]')).nativeElement.click();
          fixture.detectChanges();
        });

        it('should call the service to add it', () => {
          productReviewsService.assertCreateHasBeenCalledWith(expectedBody);
        });
      });
    });
  });

  function initTestingModule(reviewerUserId) {
    productReviewsService = new MockProductReviewsService(reviewerUserId);
    storageService = new MockStorageService();
    popupServiceSpy = jasmine.createSpyObj('PopupService', ['open']);

    TestBed.configureTestingModule({
      declarations: [HostTestComponent, ProductReviewsComponent, StarRatingComponent],
      providers: [
        { provide: ProductReviewsService, useValue: productReviewsService },
        { provide: StorageService, useValue: storageService },
        { provide: FormBuilder },
        { provide: NgZone, useClass: MockNgZone },
        { provide: PopupService, useValue: popupServiceSpy },
        {
          provide: IdProviderService,
          useValue: {
            getId: () => 'review-id',
          },
        },
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, TextFieldModule, MatIconModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }

  async function initComponent(productId: string): Promise<void> {
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(HostTestComponent);
    hostComponent = fixture.componentInstance;
    hostComponent.productId = productId;

    component = fixture.debugElement.query(By.directive(ProductReviewsComponent)).componentInstance;

    fixture.detectChanges();
  }

  @Component({
    template: '<app-product-reviews [productId]="productId"></app-product-reviews>',
  })
  class HostTestComponent {
    productId = 'product-id';
  }
});
