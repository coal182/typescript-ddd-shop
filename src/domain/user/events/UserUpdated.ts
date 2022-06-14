import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

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
