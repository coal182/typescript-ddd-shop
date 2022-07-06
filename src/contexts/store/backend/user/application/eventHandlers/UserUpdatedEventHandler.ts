import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { UserUpdated } from '@storeback/user/domain/events/UserUpdated';

@injectable()
export class UserUpdatedEventHandler implements IEventHandler<UserUpdated> {
  public event = UserUpdated.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: UserUpdated) {
    const cachedUser = await this.db.collection('users').findOne({ _id: event.guid });
    if (cachedUser) {
      await this.db.collection('users').updateOne(
        { _id: event.guid },
        {
          $set: {
            email: event.email,
            firstname: event.firstname,
            lastname: event.lastname,
            dateOfBirth: event.dateOfBirth,
            version: event.version,
          },
        }
      );
    }
  }
}
