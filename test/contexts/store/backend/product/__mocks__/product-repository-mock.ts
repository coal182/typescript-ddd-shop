import { inject, injectable, named } from 'inversify';

import { IEventStore } from '@core/i-event-store';
import { Product } from '@storeback/product/domain/product';
import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { RepositoryMock } from 'test/shared/infrastructure/repositories/repository-mock';

@injectable()
export class ProductRepositoryMock extends RepositoryMock<Product> {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Product) private readonly eventstore: IEventStore) {
    super(eventstore, Product);
  }
}
