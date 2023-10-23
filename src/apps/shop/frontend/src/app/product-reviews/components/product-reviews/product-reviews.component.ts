import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, take } from 'rxjs';
import Swal from 'sweetalert2';

import { IdProviderService } from 'src/app/shared/services/id-provider.service';
import { StorageService } from 'src/app/shared/services/storage.service';

import { ProductReview } from '../../interfaces/product-reviews.interface';
import { AddProductReviewParams, ProductReviewsService } from '../../services/product-reviews.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css'],
})
export class ProductReviewsComponent implements OnInit, OnDestroy {
  private readonly onDestroy$ = new Subject();

  @Input({ required: true })
  public productId: string;

  public userId: string;

  public reviews: ProductReview[];

  public reviewForm: FormGroup = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.required, Validators.maxLength(1000)]],
  });

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(
    private productReviewsService: ProductReviewsService,
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private storageService: StorageService,
    private idProvider: IdProviderService
  ) {
    this.userId = this.storageService.getItem('user_id');
  }

  public ngOnInit(): void {
    this.loadProductReviews();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next('');
    this.onDestroy$.complete();
  }

  public addReview(): void {
    const addReviewParams: AddProductReviewParams = {
      id: this.idProvider.getId(),
      productId: this.productId,
      userId: this.userId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
    };

    this.productReviewsService.addProductReview(addReviewParams).subscribe({
      next: (res) => {
        Swal.fire('Your review has been sent', '', 'success');
        this.reviewForm.reset();
        this.loadProductReviews();
      },
      error: (err) => {
        Swal.fire('There has been an error saving your review', '', 'error');
      },
    });
  }

  private triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  private loadProductReviews() {
    this.productReviewsService.getProductReviews(this.productId).subscribe((res) => {
      this.reviews = res.data;
      this.triggerResize();
    });
  }
}
