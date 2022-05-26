import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { UserPasswordChanged } from '@domain/user/events/UserPasswordChanged';

@injectable()
export class UserPasswordChangedEventHandler implements IEventHandler<UserPasswordChanged> {
  public event = UserPasswordChanged.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: UserPasswordChanged) {
    const cachedUser = await this.db.collection('users').findOne({ _id: event.guid });
    if (cachedUser) {
      await this.db
        .collection('users')
        .updateOne({ _id: event.guid }, { $set: { password: event.password, version: event.version } });
    }
  }
}
