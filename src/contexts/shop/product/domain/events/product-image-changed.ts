import { DomainEvent } from '@shared/domain/domain-event';

type ChangeProductImageDomainEventData = {
  readonly image: string;
};

export class ProductImageChanged extends DomainEvent {
  static readonly EVENT_NAME = 'product.image_changed';

  readonly image: string;

  constructor({
    aggregateId,
    image,
    eventId,
    occurredOn,
  }: {
    aggregateId: string;
    image: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super({ eventName: ProductImageChanged.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.image = image;
  }

  toPrimitives(): ChangeProductImageDomainEventData {
    const { image } = this;
    return {
      image,
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
      image: data.image,
      eventId,
      occurredOn,
    });
  }
}
