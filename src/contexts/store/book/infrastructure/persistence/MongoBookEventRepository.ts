import { MongoEventRepository } from '@infrastructure/persistence/mongo/MongoEventRepository';
import { DomainEvent } from '@shared/domain/DomainEvent';
import { BookEventRepository } from '@storeback/book/domain/BookEventRepository';

export class MongoBookEventRepository extends MongoEventRepository implements BookEventRepository {
  public save(events: DomainEvent[]): Promise<void> {
    return this.persist(events);
  }
  protected collectionName(): string {
    return 'book_events';
  }
}
