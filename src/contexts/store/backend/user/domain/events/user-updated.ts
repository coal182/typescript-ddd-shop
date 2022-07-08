import { Event } from '@core/event';
import { IEvent } from '@core/i-event';

export class UserUpdated extends Event implements IEvent {
  eventName = UserUpdated.name;
  aggregateName = 'user';

  constructor(
    public guid: string,
    public readonly email: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly dateOfBirth: Date
  ) {
    super();
  }
}
