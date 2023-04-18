import { IEventHandler } from '@core/i-event-handler';
import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { UserCreated } from '@storeback/user/domain/events/user-created';

@injectable()
export class AuthorCreatedEventHandler implements IEventHandler<UserCreated> {
  public event = UserCreated.name;

  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: UserCreated) {
    await this.db.collection('authors').insertOne({
      id: event.guid,
      firstname: event.firstname,
      lastname: event.lastname,
    });
  }
}
