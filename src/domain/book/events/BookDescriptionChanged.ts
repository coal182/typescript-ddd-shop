import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookDescriptionChanged extends Event implements IEvent {
  eventName = BookDescriptionChanged.name;
  aggregateName = 'book';

  constructor(public id: string, public description: string) {
    super();
  }
}
