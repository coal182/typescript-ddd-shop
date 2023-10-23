import { Injectable } from '@angular/core';
import { AddProductReviewParams, ProductReviewsService } from '../product-reviews/services/product-reviews.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockProductReviewsService extends ProductReviewsService {

  public getProductReviews = jasmine.createSpy('getProductReviews').and.callFake((productId: string) => {
    return of({
      status: 200,
      message: 'Succesfully retrieved',
      data: [
        {
          id: 'review-id',
          productId: productId, // Use the productId parameter
          userId: 'user-id',
          rating: 5,
          comment: 'Good product'
        }
      ]
    });
  });

  public addProductReview = jasmine.createSpy('addProductReview').and.callFake((params: AddProductReviewParams) => {
    return of(); // Return an observable with an empty response
  });

  public assertGetProductsReviewsHasBeenCalledWith(productId: string){
    expect(this.getProductReviews).toHaveBeenCalledWith(productId);
  }

  public assertAddProductReviewHasBeenCalledWith(params: AddProductReviewParams){
    expect(this.addProductReview).toHaveBeenCalledWith(params);
  }

}
