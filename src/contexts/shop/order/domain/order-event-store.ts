import { DomainEvent } from '@shared/domain/domain-event';
import { Uuid } from '@shared/domain/value-objects/uuid';

export interface OrderEventStore {
  save(domainEvent: Array<DomainEvent>): Promise<void>;
  findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]>;
}
