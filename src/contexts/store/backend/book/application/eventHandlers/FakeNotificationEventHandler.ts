import { injectable } from 'inversify';

import { IEventHandler } from '@core/IEventHandler';
import { BookCreated } from 'contexts/store/backend/book/domain/events/BookCreated';

@injectable()
export class FakeNotificationEventHandler implements IEventHandler<BookCreated> {
  public event = BookCreated.name;

  async handle(event: BookCreated) {
    console.log('Book info to be notified', event);
  }
}
