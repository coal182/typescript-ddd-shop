import { Db } from 'mongodb';

import { IEventHandler } from '@core/i-event-handler';
import { BookDescriptionChanged } from '@storeback/book/domain/events/book-description-changed';

export class BookDescriptionChangedEventHandler implements IEventHandler<BookDescriptionChanged> {
  public event = BookDescriptionChanged.name;

  constructor(private readonly db: Db) {}

  async handle(event: BookDescriptionChanged) {
    const cachedBook = await this.db.collection('books').findOne({ id: event.guid });
    if (cachedBook) {
      await this.db
        .collection('books')
        .updateOne({ id: event.guid }, { $set: { description: event.description, version: event.version } });
    }
  }
}
