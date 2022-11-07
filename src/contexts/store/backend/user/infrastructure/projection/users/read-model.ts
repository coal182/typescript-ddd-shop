import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IReadModelFacade } from '@core/i-read-model-facade';
import { Criteria } from '@shared/criteria/Criteria';
import { NotFoundException } from '@shared/errors/application-error';

export class UserDTO {
  constructor(public readonly guid: string, public readonly firstname: string, public readonly lastname: string) {}
}

export interface IUserReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class UserReadModelFacade implements IUserReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}
  matching(criteria: Criteria): Promise<readonly any[]> {
    throw new Error('Method not implemented.');
  }

  async getAll() {
    const users = [];

    const usersData = await this.db.collection('users').find({}).toArray();
    for (const userData of usersData) {
      users.push({ guid: userData.id, ...userData });
    }

    return users;
  }

  async getByName(name: string) {
    const users = [];

    const usersData = await this.db
      .collection('books')
      .find({ name: { $regex: `.*${name}*.`, $options: 'i' } })
      .toArray();
    for (const userData of usersData) {
      users.push({ ...userData });
    }
    return users;
  }

  async getById(guid: string) {
    const user = await this.db.collection('users').findOne({ id: guid });
    if (!user) {
      throw new NotFoundException('The requested user does not exist');
    }
    delete user.password;
    return user;
  }

  async getByField(field: string, value: any): Promise<any> {
    const user = await this.db.collection('users').findOne({ [field]: value });
    if (!user) {
      throw new NotFoundException('The requested user does not exist');
    }
    return user;
  }
}
