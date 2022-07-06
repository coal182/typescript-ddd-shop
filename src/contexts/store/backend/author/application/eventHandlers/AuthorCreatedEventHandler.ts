import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { UserCreated } from '@storeback/user/domain/events/UserCreated';

@injectable()
export class AuthorCreatedEventHandler implements IEventHandler<UserCreated> {
  public event = UserCreated.name;

  constructor(@inject(TYPES.Redis) private readonly redisClient: Redis, @inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: UserCreated) {
    /*
    this.redisClient.set(
      `authors:${event.guid}`,
      JSON.stringify({
        firstname: event.firstname,
        lastname: event.lastname,
      })
    );
    */
    await this.db.collection('authors').insertOne({
      _id: event.guid,
      firstname: event.firstname,
      lastname: event.lastname,
    });
  }
}
