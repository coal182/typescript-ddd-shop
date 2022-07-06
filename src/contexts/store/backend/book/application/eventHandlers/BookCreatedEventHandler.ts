import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { IAuthorReadModelFacade } from '@storeback/author/infrastructure/projection/authors/ReadModel';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/ReadModel';
import { BookCreated } from 'contexts/store/backend/book/domain/events/BookCreated';

@injectable()
export class BookCreatedEventHandler implements IEventHandler<BookCreated> {
  public event = BookCreated.name;

  constructor(
    @inject(TYPES.Redis) private readonly redisClient: Redis,
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.BookReadModelFacade) private readonly readModel: IBookReadModelFacade,
    @inject(TYPES.AuthorReadModelFacade) private readonly authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle(event: BookCreated) {
    /*
    const authorData = await this.authorReadModel.getById(event.authorId);
    this.redisClient.set(
      `books:${event.guid}`,
      JSON.stringify({
        name: event.name,
        author: authorData,
        price: event.price,
        version: event.version,
      })
    );
    */
    const authorData = await this.db.collection('authors').findOne({ _id: event.authorId });

    const bookToCollection = {
      _id: event.guid,
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
