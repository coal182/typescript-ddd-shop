import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookImageChanged extends Event implements IEvent {
  eventName = BookImageChanged.name;
  aggregateName = 'book';

  constructor(public id: string, public image: string) {
    super();
  }
}
