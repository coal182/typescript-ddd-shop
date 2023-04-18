import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { BookImageChanged } from '@storeback/book/domain/events/book-image-changed';

@injectable()
export class BookImageChangedEventHandler implements IEventHandler<BookImageChanged> {
  public event = BookImageChanged.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: BookImageChanged) {
    const cachedBook = await this.db.collection('books').findOne({ id: event.guid });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ id: event.guid }, { $set: { image: event.image, version: event.version } });
    }
  }
}
