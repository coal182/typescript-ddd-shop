import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/application-error';
import { IReadModelFacade } from '@core/i-read-model-facade';

export class OrderDTO {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly address: string,
    public readonly total: number,
    public readonly lines: [],
    public readonly version: number
  ) {}
}

export interface IOrderReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class OrderReadModelFacade implements IOrderReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  getAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async getByField(field: string, value: any): Promise<OrderDTO> {
    const order = await this.db.collection('orders').findOne({ [field]: value });
    if (!order) {
      throw new NotFoundException('The requested order does not exist');
    }
    const orderDTO = new OrderDTO(
      order.id,
      order.userId,
      order.name,
      order.address,
      order.total,
      order.lines,
      order.version
    );
    return orderDTO;
  }

  getByName(name: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getByUserId(userId: string) {
    const orders = await this.db.collection('orders').find({ userId: userId });
    if (!orders) {
      throw new NotFoundException('The requested order does not exist');
    }
    return orders;
  }

  async getById(guid: string) {
    const order = await this.db.collection('orders').findOne({ id: guid });
    if (!order) {
      throw new NotFoundException('The requested order does not exist');
    }
    return order;
  }
}
