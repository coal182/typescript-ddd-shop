import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@constants/types';
import { IReadModelFacade } from '@core/i-read-model-facade';
import { Criteria } from '@shared/criteria/Criteria';
import { NotFoundException } from '@shared/errors/application-error';

export class AuthorDTO {
  constructor(public readonly guid: string, public readonly firstname: string, public readonly lastname: string) {}
}

export interface IAuthorReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class AuthorReadModelFacade implements IAuthorReadModelFacade {
  constructor(@inject(TYPES.Db) private readonly db: Db) {}
  matching(criteria: Criteria): Promise<readonly any[]> {
    throw new Error('Method not implemented.');
  }

  async getAll() {
    const authors = [];

    const authorsData = await this.db.collection('authors').find({}).toArray();
    for (const authorData of authorsData) {
      authors.push({ guid: authorData.id, ...authorData });
    }

    return authors;
  }

  async getByName(name: string) {
    const authors = [];

    const authorsData = await this.db
      .collection('books')
      .find({ name: { $regex: `.*${name}*.`, $options: 'i' } })
      .toArray();
    for (const authorData of authorsData) {
      authors.push({ ...authorData });
    }
    return authors;
  }

  async getById(guid: string) {
    const author = await this.db.collection('authors').findOne({ id: guid });
    if (!author) {
      throw new NotFoundException('The requested author does not exist');
    }
    return author;
  }

  async getByField(field: string, value: any): Promise<any> {
    const author = await this.db.collection('authors').findOne({ [field]: value });
    if (!author) {
      throw new NotFoundException('The requested author does not exist');
    }
    return author;
  }
}
