import { IOrderReadModelFacade } from '@storeback/order/infrastructure/projection/orders/read-model';

export class OrderReadModelFacadeMock implements IOrderReadModelFacade {
  constructor() {
    //
  }

  async getAll(): Promise<any[]> {
    return [];
  }

  async getByName(name: string) {
    return [];
  }

  async getById(guid: string) {
    const book = {};
    return book;
  }

  async getAuthorById(authorId: string) {
    const author = {};
    return author;
  }

  async getByField(field: string, value: any): Promise<any> {
    const book = {};
    return book;
  }
}
