import {TextFieldModule} from '@angular/cdk/text-field';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA, NgZone} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {By} from '@angular/platform-browser';
import {StarRatingComponent} from 'ngx-coal';
import {IdProviderService} from 'src/app/shared/services/id-provider.service';
import {PopupService} from 'src/app/shared/services/popup/popup-service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {MockStorageService} from 'src/app/test/mock-local-storage-service';
import {MockNgZone} from 'src/app/test/mock-ng-zone';

import {ProductReviewFormData, ProductReviewsComponent} from './product-reviews.component';

import {MockProductReviewsService} from '../../../test/mock-product-reviews.service';
import {ProductReviewBody, ProductReviewsService} from '../../services/product-reviews.service';

describe(ProductReviewsComponent.name, () => {
    const productId = 'product-id';
    const userId = 'user-id';
    const otherUserId = 'other-user-id';
    const reviewId = 'review-id';
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
                expect(getFormElement()).toBeNull();
            });

            describe('when click on edit review', () => {
                beforeEach(() => {
                    clickEditButton();
                });

                it('should show the form', () => {
                    expect(getFormElement()).not.toBeNull();
                });

                it('should load the form with review id', () => {
                    expect(component.reviewForm.value.id).toBe(reviewId);
                });

                describe('and updates form saving it', () => {
                    const rating = 1;
                    const comment = 'Do not buy it!';
                    const newFormData: ProductReviewFormData = {
                        id: reviewId,
                        rating,
                        comment,
                    };
                    beforeEach(() => {
                        component.reviewForm.patchValue(newFormData);
                        fixture.detectChanges();

                        clickSaveButton();
                    });
                    it('should update the review', async () => {
                        const expectedBody: ProductReviewBody = {
                            id: reviewId,
                            productId,
                            userId,
                            rating,
                            comment,
                        };
                        productReviewsService.assertUpdateHasBeenCalledWith(expectedBody);
                        expect(popupServiceSpy.open).toHaveBeenCalledOnceWith('Your review has been updated', '', 'success');
                    });
                });
            });
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
                    id: reviewId,
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
                    clickSaveButton();
                });

                it('should send the review', () => {
                    productReviewsService.assertCreateHasBeenCalledWith(expectedBody);
                    fixture.detectChanges();
                    expect(popupServiceSpy.open).toHaveBeenCalledOnceWith('Your review has been sent', '', 'success');
                });
            });

            describe('when some field is missing', () => {
                beforeEach(() => {
                    component.reviewForm.setValue({
                        id: null,
                        rating: 5,
                        comment: null,
                    });
                    clickSaveButton();
                });

                it('should call popup service', () => {
                    expect(popupServiceSpy.open).toHaveBeenCalledOnceWith('The form is not valid', '', 'error');
                });
            });
        });
    });

    function initTestingModule(reviewerUserId): void {
        productReviewsService = new MockProductReviewsService(reviewerUserId);
        storageService = new MockStorageService();
        popupServiceSpy = jasmine.createSpyObj('PopupService', ['open']);

        TestBed.configureTestingModule({
            declarations: [HostTestComponent, ProductReviewsComponent, StarRatingComponent],
            providers: [
                {provide: ProductReviewsService, useValue: productReviewsService},
                {provide: StorageService, useValue: storageService},
                {provide: FormBuilder},
                {provide: NgZone, useClass: MockNgZone},
                {provide: PopupService, useValue: popupServiceSpy},
                {
                    provide: IdProviderService,
                    useValue: {
                        getId: (): string => reviewId,
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

    function getFormElement(): DebugElement {
        return fixture.debugElement.query(By.css('[data-test="review-form"]'));
    }

    function getSaveButton(): DebugElement {
        return fixture.debugElement.query(By.css('[data-test="save-review-btn"]'));
    }

    function clickSaveButton(): void {
        getSaveButton().nativeElement.click();
        fixture.detectChanges();
    }

    function clickEditButton(): void {
        fixture.debugElement.query(By.css('[data-test="edit-review-btn"]')).nativeElement.click();
        fixture.detectChanges();
    }

    @Component({
        template: '<app-product-reviews [productId]="productId"></app-product-reviews>',
    })
    class HostTestComponent {
        productId = 'product-id';
    }
});
