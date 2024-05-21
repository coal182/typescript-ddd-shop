import {DomainEvent} from '@domain/domain-event';

type UpdateProductReviewDomainEventData = {
    readonly productId: string;
    readonly userId: string;
    readonly rating: number;
    readonly comment: string;
};

export class ProductReviewUpdated extends DomainEvent {
    static readonly EVENT_NAME = 'product_review.updated';

    readonly productId: string;
    readonly userId: string;
    readonly rating: number;
    readonly comment: string;

    constructor({
        aggregateId,
        productId,
        userId,
        rating,
        comment,
        eventId,
        occurredOn,
    }: {
        aggregateId: string;
        productId: string;
        userId: string;
        rating: number;
        comment: string;
        eventId?: string;
        occurredOn?: Date;
    }) {
        super({eventName: ProductReviewUpdated.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
    }

    toPrimitives(): UpdateProductReviewDomainEventData {
        const {productId, userId, rating, comment} = this;
        return {
            productId,
            userId,
            rating,
            comment,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: UpdateProductReviewDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new ProductReviewUpdated({
            aggregateId,
            productId: data.productId,
            userId: data.userId,
            rating: data.rating,
            comment: data.comment,
            eventId,
            occurredOn,
        });
    }
}
