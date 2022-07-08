import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class BookImageChanged extends Event implements IEvent {
  eventName = BookImageChanged.name;
  aggregateName = 'book';

  constructor(public guid: string, public image: string) {
    super();
  }
}
