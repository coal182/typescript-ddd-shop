import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { IEventStore } from '@core/i-event-store';
import { Repository } from '@infrastructure/repositories/repository';

import { Book } from '../../domain/book';
import { IBookRepository } from '../../domain/i-book-repository';

@injectable()
export class BookRepository extends Repository<Book> implements IBookRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Book) private readonly eventstore: IEventStore) {
    super(eventstore, Book);
  }
}
