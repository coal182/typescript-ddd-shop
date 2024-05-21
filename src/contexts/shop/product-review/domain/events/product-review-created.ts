import {DomainEvent} from '@domain/domain-event';

type CreateProductReviewDomainEventData = {
    readonly productId: string;
    readonly userId: string;
    readonly rating: number;
    readonly comment: string;
    readonly createdAt: Date;
};

export class ProductReviewCreated extends DomainEvent {
    static readonly EVENT_NAME = 'product_review.created';

    readonly productId: string;
    readonly userId: string;
    readonly rating: number;
    readonly comment: string;
    readonly createdAt: Date;

    constructor({
        aggregateId,
        productId,
        userId,
        rating,
        comment,
        createdAt,
        eventId,
        occurredOn,
    }: {
        aggregateId: string;
        productId: string;
        userId: string;
        rating: number;
        comment: string;
        createdAt: Date;
        eventId?: string;
        occurredOn?: Date;
    }) {
        super({eventName: ProductReviewCreated.EVENT_NAME, aggregateId, eventId, occurredOn});
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    toPrimitives(): CreateProductReviewDomainEventData {
        const {productId, userId, rating, comment, createdAt} = this;
        return {
            productId,
            userId,
            rating,
            comment,
            createdAt,
        };
    }

    static fromPrimitives(params: {aggregateId: string; data: CreateProductReviewDomainEventData; eventId: string; occurredOn: Date}): DomainEvent {
        const {aggregateId, data, occurredOn, eventId} = params;
        return new ProductReviewCreated({
            aggregateId,
            productId: data.productId,
            userId: data.userId,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.createdAt,
            eventId,
            occurredOn,
        });
    }
}
