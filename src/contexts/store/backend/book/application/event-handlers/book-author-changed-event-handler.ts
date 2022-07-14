import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { IAuthorReadModelFacade } from '@storeback/author/infrastructure/projection/authors/read-model';
import { BookAuthorChanged } from '@storeback/book/domain/events/book-author-changed';

@injectable()
export class BookAuthorChangedEventHandler implements IEventHandler<BookAuthorChanged> {
  public event = BookAuthorChanged.name;

  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.AuthorReadModelFacade) private authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle(event: BookAuthorChanged) {
    const cachedBook = await this.db.collection('books').findOne({ id: event.guid });
    const authorData = await this.db.collection('authors').findOne({ id: event.authorId });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ id: event.guid }, { $set: { author: authorData, version: event.version } });
    }
  }
}
