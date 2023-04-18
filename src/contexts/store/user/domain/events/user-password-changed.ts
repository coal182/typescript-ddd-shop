import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class UserPasswordChanged extends Event implements IEvent {
  eventName = UserPasswordChanged.name;
  aggregateName = 'user';

  constructor(public guid: string, public password: string) {
    super();
  }
}
