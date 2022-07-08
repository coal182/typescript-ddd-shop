import { IRepository } from '@core/i-repository';

import { User } from './user';

export interface IUserRepository extends IRepository<User> {}
