import { DomainEvent } from '@shared/domain/domain-event';

type ChangeProductImageDomainEventData = {
  readonly images: string[];
};

export class ProductImageChanged extends DomainEvent {
  static readonly EVENT_NAME = 'product.image_changed';

  readonly images: string[];

  constructor({
    aggregateId,
    images,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    images: string[];
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: ProductImageChanged.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.images = images;
  }

  toPrimitives(): ChangeProductImageDomainEventData {
    const { images } = this;
    return {
      images,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: ChangeProductImageDomainEventData;
    eventId: string;
    occurredOn: Date;
  }): DomainEvent {
    const { aggregateId, data, occurredOn, eventId } = params;
    return new ProductImageChanged({
      aggregateId,
      images: data.images,
      eventId,
      occurredOn,
    });
  }
}
