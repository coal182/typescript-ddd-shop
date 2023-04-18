import { injectable } from 'inversify';

import { IEventHandler } from '@core/i-event-handler';
import { BookCreated } from '@storeback/book/domain/events/book-created';

@injectable()
export class FakeNotificationEventHandler implements IEventHandler<BookCreated> {
  public event = BookCreated.name;

  async handle(event: BookCreated) {
    console.log('Book info to be notified', event);
  }
}
