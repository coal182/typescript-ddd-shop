import { HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';

import { ProductReviewsResponse } from '../interfaces/product-reviews.interface';

import { HttpProductReviewsService } from './http-product-reviews.service';
import { ProductReviewBody, ProductReviewsService } from './product-reviews.service';

describe(HttpProductReviewsService.name, () => {
  const productId = 'product-id';
  let service: ProductReviewsService;
  let httpMock: HttpTestingController;

  let mockProductReviewsResponse: ProductReviewsResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [HttpProductReviewsService] });
    service = TestBed.inject(HttpProductReviewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to get product reviews by product id', () => {
    mockProductReviewsResponse = getMockedProductReviewsResponse();

    it('should send a GET request with the product id to fetch its reviews', () => {
      service.get(productId).subscribe((productReviews) => {
        expect(productReviews.status).toBe(HttpStatusCode.Ok);
        expect(productReviews.data.length).toBe(2);
        expect(productReviews).toEqual(mockProductReviewsResponse);
      });
      const req = httpMock.expectOne(
        (request) => request.url === `${environment.apiUrl}product-review/product/${productId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProductReviewsResponse);
    });
  });

  describe('when asked to add a product review', () => {
    const productReviewToAdd: ProductReviewBody = {
      id: 'product-review-id',
      productId,
      userId: 'user-id',
      rating: 5,
      comment: 'Good product',
    };

    it('should send a POST request with the correct data', () => {
      service.create(productReviewToAdd).subscribe();

      const req = httpMock.expectOne((request) => request.url === `${environment.apiUrl}product-review`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(productReviewToAdd);
      req.flush({ status: HttpStatusCode.Created });
    });
  });

  function getMockedProductReviewsResponse(): ProductReviewsResponse {
    return {
      status: HttpStatusCode.Ok,
      message: 'Successfully retrieve the product reviews',
      data: [
        {
          id: 'bfd87817-dca3-47a8-baa3-4bcb451ee785',
          productId: productId,
          userId: '4b75043b-3d9c-42ad-ac00-8630d8435cd2',
          rating: 5,
          comment: 'Nice product, it is perfect.',
        },
        {
          id: '168bd580-db5e-43a2-a589-ec2d6f0efa76',
          productId: productId,
          userId: '4b75043b-3d9c-42ad-ac00-8630d8435cd2',
          rating: 4,
          comment: 'Not bad',
        },
      ],
    };
  }
});
