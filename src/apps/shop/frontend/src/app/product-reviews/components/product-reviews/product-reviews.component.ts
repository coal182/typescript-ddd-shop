import {Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {IdProviderService} from 'src/app/shared/services/id-provider.service';
import {PopupService} from 'src/app/shared/services/popup/popup-service';
import {StorageService} from 'src/app/shared/services/storage.service';

import {ProductReview} from '../../interfaces/product-reviews.interface';
import {ProductReviewBody, ProductReviewsService} from '../../services/product-reviews.service';

type ProductReviewForm = FormGroup<{
    id: FormControl<string | null>;
    rating: FormControl<number>;
    comment: FormControl<string>;
}>;

export interface ProductReviewFormData {
    id: string | null;
    rating: number;
    comment: string;
}

@Component({
    selector: 'app-product-reviews',
    templateUrl: './product-reviews.component.html',
    styleUrls: ['./product-reviews.component.css'],
})
export class ProductReviewsComponent implements OnInit, OnDestroy {
    private readonly onDestroy$ = new Subject();
    private defaultFormValue: ProductReviewFormData = {id: null, rating: 0, comment: ''};

    @Input({required: true})
    public productId: string;

    public userId: string;

    public reviews: ProductReview[];

    public rating: FormControl<number | null> = new FormControl<number>(0, [Validators.required]);

    public reviewForm: ProductReviewForm = this.fb.group({
        id: [null],
        rating: this.rating,
        comment: new FormControl<string>('', [Validators.required, Validators.maxLength(1000)]),
    });

    public shouldShowForm = false;

    constructor(
        private productReviewsService: ProductReviewsService,
        private fb: FormBuilder,
        private ngZone: NgZone,
        private storageService: StorageService,
        private idProvider: IdProviderService,
        private popupService: PopupService,
    ) {
        this.userId = this.storageService.getItem('user_id');
        this.reviewForm.patchValue(this.defaultFormValue);
    }

    get commentErrorMsg(): string {
        const errors = this.reviewForm.get('comment')?.errors;
        if (errors?.['required']) {
            return 'Comment is mandatory';
        } else if (errors?.['maxLength']) {
            return 'Comment is too long, maximum is 1000';
        }

        return '';
    }

    public invalidInput(inputName: string): boolean {
        return this.reviewForm.controls[inputName].invalid;
    }

    public ngOnInit(): void {
        this.loadProductReviews();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next('');
        this.onDestroy$.complete();
    }

    public saveReview(): void {
        if (!this.reviewForm.valid) {
            this.reviewForm.markAllAsTouched();
            this.popupService.open('The form is not valid', '', 'error');
            return;
        }

        const commonReviewParams = {
            productId: this.productId,
            userId: this.userId,
            rating: this.reviewForm.value.rating,
            comment: this.reviewForm.value.comment,
        };

        if (this.reviewForm.value.id) {
            const updateReviewParams: ProductReviewBody = {
                id: this.reviewForm.value.id,
                ...commonReviewParams,
            };

            this.productReviewsService.update(updateReviewParams).subscribe({
                next: () => {
                    this.popupService.open('Your review has been updated', '', 'success');
                    this.resetForm();
                    this.loadProductReviews();
                },
                error: () => {
                    this.popupService.open('There has been an error updating your review', '', 'error');
                },
            });
        } else {
            const addReviewParams: ProductReviewBody = {
                id: this.idProvider.getId(),
                ...commonReviewParams,
            };

            this.productReviewsService.create(addReviewParams).subscribe({
                next: () => {
                    this.popupService.open('Your review has been sent', '', 'success');
                    this.resetForm();
                    this.loadProductReviews();
                },
                error: () => {
                    this.popupService.open('There has been an error saving your review', '', 'error');
                },
            });
        }
    }

    public edit(review: ProductReview): void {
        this.reviewForm.patchValue({id: review.id, rating: review.rating, comment: review.comment});
        this.shouldShowForm = true;
    }

    private resetForm(): void {
        this.reviewForm.reset(this.defaultFormValue);
        // Object.keys(this.reviewForm.controls).forEach((key) => {
        //   this.reviewForm.controls[key].setErrors(null);
        // });
    }

    private loadProductReviews(): void {
        this.productReviewsService.get(this.productId).subscribe((res) => {
            this.reviews = res.data;

            this.handleFormVisibility();
        });
    }

    private handleFormVisibility(): void {
        if (this.reviews.some((review) => review.userId === this.userId)) {
            this.shouldShowForm = false;
        } else {
            this.shouldShowForm = true;
        }
    }
}
