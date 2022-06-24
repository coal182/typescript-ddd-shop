import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/ApplicationError';
import { IReadModelFacade } from '@core/IReadModelFacade';

export class CartDTO {
  constructor(
    public readonly guid: string,
    public readonly userId: string,
    public readonly content: Record<string, number>
  ) {}
}

export interface ICartReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class CartReadModelFacade implements ICartReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}
  getAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  getById(guid: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getByField(field: string, value: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getByName(name: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getByUserId(userId: string) {
    const user = await this.db.collection('carts').findOne({ userId: userId });
    if (!user) {
      throw new NotFoundException('The requested cart does not exist');
    }
    delete user.password;
    return user;
  }
}
