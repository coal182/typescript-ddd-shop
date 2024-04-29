import { TextFieldModule } from '@angular/cdk/text-field';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxCoalModule } from 'ngx-coal';

import { SharedModule } from '../shared/shared.module';

import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';
import { HttpProductReviewsService } from './services/http-product-reviews.service';
import { ProductReviewsService } from './services/product-reviews.service';

@NgModule({
  declarations: [ProductReviewsComponent],
  imports: [SharedModule, MatFormFieldModule, MatInputModule, TextFieldModule, ReactiveFormsModule, NgxCoalModule],
  exports: [ProductReviewsComponent],
  providers: [{ provide: ProductReviewsService, useClass: HttpProductReviewsService }],
})
export class ProductReviewsModule {}
