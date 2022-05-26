import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/ApplicationError';
import { IReadModelFacade } from '@core/IReadModelFacade';

export class UserDTO {
  constructor(public readonly guid: string, public readonly firstname: string, public readonly lastname: string) {}
}

export interface IUserReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class UserReadModelFacade implements IUserReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async getAll() {
    const users = [];

    const usersData = await this.db.collection('users').find({}).toArray();
    for (const userData of usersData) {
      users.push({ guid: userData._id, ...userData });
    }

    return users;
  }

  async getById(guid: string) {
    const user = await this.db.collection('users').findOne({ _id: guid });
    if (!user) {
      throw new NotFoundException('The requested user does not exist');
    }
    return user;
  }
}
