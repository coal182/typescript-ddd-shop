import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule } from '@angular/forms';
import { StarRatingComponent } from './components/star-rating/star-rating.component';

@NgModule({
  declarations: [ProductReviewsComponent, StarRatingComponent],
  imports: [
    SharedModule,
    MatFormFieldModule, MatInputModule, TextFieldModule, ReactiveFormsModule
  ],
  exports: [ProductReviewsComponent],
})
export class ProductReviewsModule {}
