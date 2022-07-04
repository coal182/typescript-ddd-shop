import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { IAuthorReadModelFacade } from '@application/projection/author/ReadModel';
import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookAuthorChanged } from '@domain/book/events/BookAuthorChanged';

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
    const cachedBook = await this.db.collection('books').findOne({ _id: event.id });
    const authorData = await this.db.collection('authors').findOne({ _id: event.authorId });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ _id: event.id }, { $set: { author: authorData, version: event.version } });
    }
  }
}
