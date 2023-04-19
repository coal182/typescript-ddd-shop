import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@storeback/shared/constants/types';
import { IReadModelFacade } from '@core/i-read-model-facade';
import { Criteria } from '@shared/criteria/Criteria';
import { NotFoundException } from '@shared/errors/application-error';

export class CartDTO {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: [],
    public readonly version: number
  ) {}
}

export interface ICartReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class CartReadModelFacade implements ICartReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}
  matching(criteria: Criteria): Promise<readonly any[]> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getByField(field: string, value: any): Promise<CartDTO> {
    const cart = await this.db.collection('carts').findOne({ [field]: value });
    if (!cart) {
      throw new NotFoundException('The requested cart does not exist');
    }
    const cartDTO = new CartDTO(cart.id, cart.userId, cart.items, cart.version);
    return cartDTO;
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
    const cart = await this.db.collection('carts').findOne({ id: guid });
    if (!cart) {
      throw new NotFoundException('The requested cart does not exist');
    }
    return cart;
  }
}
