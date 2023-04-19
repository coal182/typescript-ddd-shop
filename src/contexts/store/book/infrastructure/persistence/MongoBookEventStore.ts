import { MongoEventStore } from '@infrastructure/persistence/mongo/MongoEventStore';
import { DomainEvent } from '@shared/domain/DomainEvent';
import { BookEventStore } from '@storeback/book/domain/BookEventStore';

export class MongoBookEventStore extends MongoEventStore implements BookEventStore {
  public save(events: DomainEvent[]): Promise<void> {
    return this.persist(events);
  }
  protected collectionName(): string {
    return 'book_events';
  }
}
