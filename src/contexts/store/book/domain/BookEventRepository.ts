import { DomainEvent } from '@core/domain-event';
import { Uuid } from '@shared/value-objects/uuid';

export interface BookEventRepository {
  save(domainEvent: Array<DomainEvent>): Promise<void>;
  findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]>;
}
