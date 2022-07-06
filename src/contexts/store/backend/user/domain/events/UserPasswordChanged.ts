import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class UserPasswordChanged extends Event implements IEvent {
  eventName = UserPasswordChanged.name;
  aggregateName = 'user';

  constructor(public guid: string, public password: string) {
    super();
  }
}
