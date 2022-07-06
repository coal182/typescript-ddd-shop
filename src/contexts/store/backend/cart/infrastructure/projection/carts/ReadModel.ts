import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/ApplicationError';
import { IReadModelFacade } from '@core/IReadModelFacade';

export class CartDTO {
  constructor(
    public readonly guid: string,
    public readonly userId: string,
    public readonly items: Record<string, number>
  ) {}
}

export interface ICartReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class CartReadModelFacade implements ICartReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  getAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getByField(field: string, value: any): Promise<any> {
    const cart = await this.db.collection('carts').findOne({ [field]: value });
    if (!cart) {
      throw new NotFoundException('The requested cart does not exist');
    }
    return cart;
  }

  getByName(name: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getByUserId(userId: string) {
    const cart = await this.db.collection('carts').findOne({ userId: userId });
    if (!cart) {
      throw new NotFoundException('The requested cart does not exist');
    }
    return cart;
  }

  async getById(guid: string) {
    const cart = await this.db.collection('carts').findOne({ _id: guid });
    if (!cart) {
      throw new NotFoundException('The requested cart does not exist');
    }
    return cart;
  }
}
