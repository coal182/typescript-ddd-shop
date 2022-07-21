import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class OrderInitiated extends Event implements IEvent {
  eventName = OrderInitiated.name;
  aggregateName = 'order';

  constructor(
    public guid: string,
    public userId: string,
    public status: string,
    public name: string,
    public address: string,
    public total: number
  ) {
    super();
  }
}
