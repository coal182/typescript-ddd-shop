import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookDescriptionChanged } from 'contexts/store/backend/book/domain/events/BookDescriptionChanged';

@injectable()
export class BookDescriptionChangedEventHandler implements IEventHandler<BookDescriptionChanged> {
  public event = BookDescriptionChanged.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: BookDescriptionChanged) {
    const cachedBook = await this.db.collection('books').findOne({ _id: event.guid });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ _id: event.guid }, { $set: { description: event.description, version: event.version } });
    }
  }
}
