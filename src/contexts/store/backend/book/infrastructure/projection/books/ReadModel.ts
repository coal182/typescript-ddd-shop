import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/ApplicationError';
import { IReadModelFacade } from '@core/IReadModelFacade';

export class BookListDTO {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly image: string,
    public readonly author: string,
    public readonly price: number,
    public readonly version: number
  ) {}
}

export interface IBookReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class BookReadModelFacade implements IBookReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}

  async getAll() {
    const books = [];

    const booksData = await this.db.collection('books').find({}).toArray();
    for (const bookData of booksData) {
      books.push({ ...bookData });
    }
    return books;
  }

  async getByName(name: string) {
    const books = [];

    const booksData = await this.db
      .collection('books')
      .find({ name: { $regex: `.*${name}*.`, $options: 'i' } })
      .toArray();
    for (const bookData of booksData) {
      books.push({ ...bookData });
    }
    return books;
  }

  async getById(guid: string) {
    const book = await this.db.collection('books').findOne({ _id: guid });
    if (!book) {
      throw new NotFoundException('The requested book does not exist');
    }
    return book;
  }

  async getAuthorById(authorId: string) {
    const author = await this.db.collection('authors').findOne({ _id: authorId });
    if (!author) {
      throw new NotFoundException('The requested author does not exist');
    }
    return author;
  }

  async getByField(field: string, value: any): Promise<any> {
    const book = await this.db.collection('books').findOne({ [field]: value });
    if (!book) {
      throw new NotFoundException('The requested author does not exist');
    }
    return book;
  }
}
