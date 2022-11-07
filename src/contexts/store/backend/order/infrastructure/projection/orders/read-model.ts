import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IReadModelFacade } from '@core/i-read-model-facade';
import { Criteria } from '@shared/criteria/Criteria';
import { NotFoundException } from '@shared/errors/application-error';

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
  matching(criteria: Criteria): Promise<readonly any[]> {
    throw new Error('Method not implemented.');
  }

  async getAll() {
    const orders = [];

    const ordersData = await this.db.collection('orders').find({}).toArray();
    for (const orderData of ordersData) {
      orders.push({ ...orderData });
    }
    return orders;
  }

  async getByField(field: string, value: any): Promise<Array<OrderDTO>> {
    const orders = [];

    const ordersData = await this.db
      .collection('orders')
      .find({ [field]: value })
      .toArray();
    for (const orderData of ordersData) {
      const orderDTO = new OrderDTO(
        orderData.id,
        orderData.userId,
        orderData.name,
        orderData.address,
        orderData.total,
        orderData.lines,
        orderData.version
      );
      orders.push(orderDTO);
    }
    return orders;
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
