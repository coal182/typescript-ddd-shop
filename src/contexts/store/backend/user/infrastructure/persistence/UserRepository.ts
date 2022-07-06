import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Repository } from '@infrastructure/repositories/Repository';
import { IUserRepository } from '@storeback/user/domain/IUserRepository';
import { User } from '@storeback/user/domain/User';

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.User) private readonly eventstore: IEventStore) {
    super(eventstore, User);
  }
}
