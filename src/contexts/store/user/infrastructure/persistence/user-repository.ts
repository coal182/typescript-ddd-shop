import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@storeback/shared/constants/types';
import { IEventStore } from '@core/i-event-store';
import { Repository } from '@infrastructure/repositories/repository';
import { IUserRepository } from '@storeback/user/domain/i-user-repository';
import { User } from '@storeback/user/domain/user';

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.User) private readonly eventstore: IEventStore) {
    super(eventstore, User);
  }
}
