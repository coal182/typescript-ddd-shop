import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class AuthorCreated extends Event implements IEvent {
  eventName = AuthorCreated.name;
  aggregateName = 'book';

  constructor(public guid: string, public name: string, public author: string, public price: number) {
    super();
  }
}
