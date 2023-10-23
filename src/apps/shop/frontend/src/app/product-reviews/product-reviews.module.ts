import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '../shared/shared.module';

import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { HttpProductReviewsService } from './services/http-product-reviews.service';
import { ProductReviewsService } from './services/product-reviews.service';

@NgModule({
  declarations: [ProductReviewsComponent, StarRatingComponent],
  imports: [SharedModule, MatFormFieldModule, MatInputModule, TextFieldModule, ReactiveFormsModule],
  exports: [ProductReviewsComponent],
  providers: [{ provide: ProductReviewsService, useClass: HttpProductReviewsService }],
})
export class ProductReviewsModule {}
