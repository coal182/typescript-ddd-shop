import {Primitives} from '@domain/value-objects/primitives-type';
import {Command} from '@shared/domain/command';
import {Type, number, string, type} from 'io-ts';

export const updateProductReviewCodec: Type<Primitives<UpdateProductReviewCommand>> = type({
    id: string,
    productId: string,
    userId: string,
    rating: number,
    comment: string,
});

export class UpdateProductReviewCommand extends Command {
    public id: string;
    public productId: string;
    public userId: string;
    public rating: number;
    public comment: string;

    constructor(id: string, productId: string, userId: string, rating: number, comment: string) {
        super();
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
    }
}
