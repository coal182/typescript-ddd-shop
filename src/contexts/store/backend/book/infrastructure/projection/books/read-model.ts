import { inject, injectable } from 'inversify';
import { Collection, Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IReadModelFacade } from '@core/i-read-model-facade';
import { Criteria } from '@shared/criteria/Criteria';
import { NotFoundException } from '@shared/errors/application-error';
import { BookResponse } from '@storeback/book/application/books-response';

import { MongoCriteriaConverter } from './mongo-criteria-converter';

export interface IBookReadModelFacade extends IReadModelFacade<any> {}

export interface BookDocument {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: string;
  author: Author;
  price: number;
  version: number;
}

export interface Author {
  _id: string;
  id: string;
  firstname: string;
  lastname: string;
}

@injectable()
export class BookReadModelFacade implements IBookReadModelFacade {
  private criteriaConverter: MongoCriteriaConverter;

  constructor(@inject(TYPES.Db) private readonly db: Db) {
    this.criteriaConverter = new MongoCriteriaConverter();
  }

  protected collectionName = 'books';

  protected async collection(): Promise<Collection> {
    return await this.db.collection(this.collectionName);
  }

  async matching(criteria: Criteria): Promise<BookResponse[]> {
    const query = this.criteriaConverter.convert(criteria);
    console.log('🚀 ~ file: read-model.ts ~ line 48 ~ BookReadModelFacade ~ matching ~ query', query);

    const collection = await this.collection();

    return await collection
      .find<BookDocument>(query.filter, {})
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit)
      .toArray();
  }

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
    const book = await this.db.collection('books').findOne({ id: guid });
    if (!book) {
      throw new NotFoundException('The requested book does not exist');
    }
    return book;
  }

  async getAuthorById(authorId: string) {
    const author = await this.db.collection('authors').findOne({ id: authorId });
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
