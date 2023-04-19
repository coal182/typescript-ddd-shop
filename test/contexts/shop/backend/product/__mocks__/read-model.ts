import { Criteria } from '@shared/criteria/Criteria';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';

export class BookReadModelFacadeMock implements IBookReadModelFacade {
  constructor() {
    //
  }

  async matching(criteria: Criteria): Promise<any[]> {
    throw new Error('Method not implemented.');
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
