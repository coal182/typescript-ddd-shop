import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';

import { User } from './user';
import { UserId } from './user-id';

export interface UserRepository {
  save(user: User): Promise<void>;
  search(id: UserId): Promise<Nullable<User>>;
  searchAll(): Promise<Array<User>>;
  matching(criteria: Criteria): Promise<Array<User>>;
}
