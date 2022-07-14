import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/i-event-store';
import { Book } from '@storeback/book/domain/book';
import { IBookRepository } from '@storeback/book/domain/i-book-repository';
import { RepositoryMock } from 'test/shared/infrastructure/repositories/repository-mock';

@injectable()
export class BookRepositoryMock extends RepositoryMock<Book> implements IBookRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Book) private readonly eventstore: IEventStore) {
    super(eventstore, Book);
  }
}
