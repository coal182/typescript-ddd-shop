import { Component, Inject, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductReview } from '../../interfaces/product-reviews.interface';
import { HttpProductReviewsService } from '../../services/http-product-reviews.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Subject, take } from 'rxjs';
import { AddProductReviewParams } from '../../services/product-reviews.service';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css'],
})
export class ProductReviewsComponent implements OnInit, OnDestroy {

  private readonly onDestroy$ = new Subject();

  @Input({required: true})
  public productId: string;

  public userId: string;

  public reviews: ProductReview[];

  public ratingControl = new FormControl<number>(0);
  public reviewForm: FormGroup = this.fb.group({
    rating: this.ratingControl,
    comment: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private productReviewsService: HttpProductReviewsService, private fb: FormBuilder, private _ngZone: NgZone, @Inject('StorageService') private storageService: StorageService){
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
      id: uuidv4(),
      productId: this.productId,
      userId: this.userId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
    }

    this.productReviewsService.addProductReview(addReviewParams).subscribe({
      next: res => {
        Swal.fire('Your review has been sent', '', 'success');
        this.reviewForm.reset();
        this.loadProductReviews();
      }, 
      error: (err) => {
        Swal.fire('There has been an error saving your review', '', 'error');
      }
    })
  }
  
  private triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  private loadProductReviews() {
    this.productReviewsService.getProductReviews(this.productId).subscribe(res => {
      this.reviews = res.data;
      this.triggerResize();
    });
  }


}
