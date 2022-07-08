import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class BookAuthorChanged extends Event implements IEvent {
  eventName = BookAuthorChanged.name;
  aggregateName = 'book';

  constructor(public guid: string, public authorId: string) {
    super();
  }
}
