import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { IAuthorReadModelFacade } from '@application/projection/author/ReadModel';
import { IBookReadModelFacade } from '@application/projection/book/ReadModel';
import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookCreated } from '@domain/book/events/BookCreated';

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
    await this.db.collection('books').insertOne({
      _id: event.guid,
      name: event.name,
      description: event.description,
      author: authorData,
      price: event.price,
      version: event.version,
    });
  }
}
