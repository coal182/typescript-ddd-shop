import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Repository } from '@infrastructure/repositories/Repository';

import { Book } from '../../domain/Book';
import { IBookRepository } from '../../domain/IBookRepository';

@injectable()
export class BookRepository extends Repository<Book> implements IBookRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Book) private readonly eventstore: IEventStore) {
    super(eventstore, Book);
  }
}
