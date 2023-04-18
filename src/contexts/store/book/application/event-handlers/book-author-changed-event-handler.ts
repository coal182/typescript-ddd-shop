import { IEventHandler } from '@core/i-event-handler';
import { BookAuthorChanged } from '@storeback/book/domain/events/book-author-changed';
import { TYPES } from '@storeback/shared/constants/types';
import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { IAuthorReadModelFacade } from 'src/contexts/store/author/infrastructure/projection/authors/read-model';

@injectable()
export class BookAuthorChangedEventHandler implements IEventHandler<BookAuthorChanged> {
  public event = BookAuthorChanged.name;

  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.AuthorReadModelFacade) private authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle(event: BookAuthorChanged) {
    const cachedBook = await this.db.collection('books').findOne({ id: event.guid });
    const authorData = await this.db.collection('authors').findOne({ id: event.author });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ id: event.guid }, { $set: { author: authorData, version: event.version } });
    }
  }
}
