import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class BookDescriptionChanged extends Event implements IEvent {
  eventName = BookDescriptionChanged.name;
  aggregateName = 'book';

  constructor(public guid: string, public description: string) {
    super();
  }
}
