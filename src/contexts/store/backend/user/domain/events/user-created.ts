import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class UserCreated extends Event implements IEvent {
  eventName = UserCreated.name;
  aggregateName = 'user';

  constructor(
    public guid: string,
    public email: string,
    public firstname: string,
    public lastname: string,
    public dateOfBirth: Date,
    public password: string
  ) {
    super();
  }
}
