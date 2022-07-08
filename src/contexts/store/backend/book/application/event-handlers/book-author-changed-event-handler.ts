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
    /*
    const cachedBook = await this.redisClient.get(`books:${event.guid}`);
    if (cachedBook) {
      const book = JSON.parse(cachedBook);
      const authorData = await this.authorReadModel.getById(event.authorId);
      await this.redisClient.set(
        `books:${event.guid}`,
        JSON.stringify({
          ...book,
          author: authorData,
          version: event.version,
        })
      );
    }
    */
    const cachedBook = await this.db.collection('books').findOne({ _id: event.guid });
    const authorData = await this.db.collection('authors').findOne({ _id: event.authorId });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ _id: event.guid }, { $set: { author: authorData, version: event.version } });
    }
  }
}
