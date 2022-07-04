import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookDescriptionChanged } from '@domain/book/events/BookDescriptionChanged';

@injectable()
export class BookDescriptionChangedEventHandler implements IEventHandler<BookDescriptionChanged> {
  public event = BookDescriptionChanged.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: BookDescriptionChanged) {
    const cachedBook = await this.db.collection('books').findOne({ _id: event.id });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ _id: event.id }, { $set: { description: event.description, version: event.version } });
    }
  }
}
