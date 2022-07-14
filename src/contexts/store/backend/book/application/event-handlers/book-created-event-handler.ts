import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { IAuthorReadModelFacade } from '@storeback/author/infrastructure/projection/authors/read-model';
import { BookCreated } from '@storeback/book/domain/events/book-created';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';

@injectable()
export class BookCreatedEventHandler implements IEventHandler<BookCreated> {
  public event = BookCreated.name;

  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.BookReadModelFacade) private readonly readModel: IBookReadModelFacade,
    @inject(TYPES.AuthorReadModelFacade) private readonly authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle(event: BookCreated) {
    const authorData = await this.db.collection('authors').findOne({ id: event.authorId });

    const bookToCollection = {
      id: event.guid,
      name: event.name,
      description: event.description,
      image: event.image,
      author: authorData,
      price: event.price,
      version: event.version,
    };

    await this.db.collection('books').insertOne(bookToCollection);
  }
}
