import { DomainEvent } from '@shared/domain/domain-event';

type ProductsCounterIncrementedData = { total: number };

export class ProductsCounterIncremented extends DomainEvent {
  static readonly EVENT_NAME = 'products_counter.incremented';
  readonly total: number;

  constructor(data: { aggregateId: string; total: number; eventId?: string; occurredOn?: Date }) {
    const { aggregateId, eventId, occurredOn } = data;
    super({ eventName: ProductsCounterIncremented.EVENT_NAME, aggregateId, eventId, occurredOn });
    this.total = data.total;
  }

  toPrimitives() {
    return {
      total: this.total,
    };
  }

  static fromPrimitives(params: {
    aggregateId: string;
    data: ProductsCounterIncrementedData;
    eventId: string;
    occurredOn: Date;
  }) {
    const { aggregateId, data, eventId, occurredOn } = params;
    return new ProductsCounterIncremented({
      aggregateId,
      total: data.total,
      eventId,
      occurredOn,
    });
  }
}
