import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookCreated extends Event implements IEvent {
  eventName = BookCreated.name;
  aggregateName = 'book';

  constructor(
    public guid: string,
    public name: string,
    public description: string,
    public image: string,
    public authorId: string,
    public price: number
  ) {
    super();
  }
}
