import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { UserPasswordChanged } from '@storeback/user/domain/events/user-password-changed';

@injectable()
export class UserPasswordChangedEventHandler implements IEventHandler<UserPasswordChanged> {
  public event = UserPasswordChanged.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: UserPasswordChanged) {
    const cachedUser = await this.db.collection('users').findOne({ id: event.guid });
    if (cachedUser) {
      await this.db
        .collection('users')
        .updateOne({ id: event.guid }, { $set: { password: event.password, version: event.version } });
    }
  }
}
