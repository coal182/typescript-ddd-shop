import {of} from 'rxjs';

import {ProductReviewBody, ProductReviewsService} from '../product-reviews/services/product-reviews.service';

export class MockProductReviewsService extends ProductReviewsService {
    public constructor(private reviewerUserId: string) {
        super();
    }

    public get = jasmine.createSpy('get').and.callFake((productId: string) => {
        return of({
            status: 200,
            message: 'Succesfully retrieved',
            data: [
                {
                    id: 'review-id',
                    productId: productId, // Use the productId parameter
                    userId: this.reviewerUserId,
                    rating: 5,
                    comment: 'Good product',
                },
            ],
        });
    });

    public create = jasmine.createSpy('create').and.callFake(() => {
        return of(() => {}); // Return an observable with an empty response
    });

    public update = jasmine.createSpy('update').and.callFake(() => {
        return of(() => {}); // Return an observable with an empty response
    });

    public assertGetHasBeenCalledWith(productId: string): void {
        expect(this.get).toHaveBeenCalledWith(productId);
    }

    public assertCreateHasBeenCalledWith(body: ProductReviewBody): void {
        expect(this.create).toHaveBeenCalledWith(body);
    }

    public assertUpdateHasBeenCalledWith(body: ProductReviewBody): void {
        expect(this.update).toHaveBeenCalledWith(body);
    }
}
