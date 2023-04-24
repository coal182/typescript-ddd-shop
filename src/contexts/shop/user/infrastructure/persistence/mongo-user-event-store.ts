import { MongoEventStore } from '@infrastructure/persistence/mongo/mongo-event-store';
import { DomainEvent, DomainEventClass } from '@shared/domain/domain-event';
import { Uuid } from '@shared/domain/value-objects/uuid';
import { UserPasswordChanged } from '@storeback/user/domain/events/user-password-changed';
import { UserUpdated } from '@storeback/user/domain/events/user-updated';
import { UserCreated } from 'src/contexts/shop/user/domain/events/user-created';
import { UserEventStore } from 'src/contexts/shop/user/domain/user-event-store';

export class MongoUserEventStore extends MongoEventStore implements UserEventStore {
  public save(events: DomainEvent[]): Promise<void> {
    return this.persist(events);
  }
  public async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
    console.log('📌 ~ aggregateId:', aggregateId);
    return super.findByAggregateId(aggregateId);
  }
  protected collectionName(): string {
    return 'user_events';
  }

  protected eventsMap(): Map<string, DomainEventClass> {
    return new Map<string, DomainEventClass>([
      ['user.created', UserCreated],
      ['user.updated', UserUpdated],
      ['user.password_changed', UserPasswordChanged],
    ]);
  }
}
