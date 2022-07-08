import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class LoanCreated extends Event implements IEvent {
  eventName = LoanCreated.name;
  aggregateName = 'loan';

  constructor(public guid: string, public bookId: string, public userId: string) {
    super();
  }
}
