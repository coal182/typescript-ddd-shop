import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/i-event-handler';
import { UserCreated } from '@storeback/user/domain/events/user-created';

@injectable()
export class UserCreatedEventHandler implements IEventHandler<UserCreated> {
  event = UserCreated.name;

  constructor(@inject(TYPES.Redis) private readonly redisClient: Redis, @inject(TYPES.Db) private readonly db: Db) {}

  async handle(event: UserCreated) {
    /*
    this.redisClient.set(
      `users:${event.guid}`,
      JSON.stringify({
        email: event.email,
        firstname: event.firstname,
        lastname: event.lastname,
        dateOfBirth: event.dateOfBirth.toString(),
      })
    );
    */
    await this.db.collection('users').insertOne({
      _id: event.guid,
      email: event.email,
      firstname: event.firstname,
      lastname: event.lastname,
      dateOfBirth: event.dateOfBirth.toString(),
      password: event.password,
    });
  }
}
