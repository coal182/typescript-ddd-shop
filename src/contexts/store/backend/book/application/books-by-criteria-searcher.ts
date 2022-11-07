import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { Criteria } from '@shared/criteria/Criteria';
import { Filters } from '@shared/criteria/Filters';
import { Order } from '@shared/criteria/Order';

import { BookReadModelFacade } from '../infrastructure/projection/books/read-model';

import { BooksResponse } from './books-response';

@injectable()
export class BooksByCriteriaSearcher {
  constructor(@inject(TYPES.BookReadModelFacade) private readonly readmodel: BookReadModelFacade) {}

  async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<BooksResponse> {
    const criteria = new Criteria(filters, order, limit, offset);

    const books = await await this.readmodel.matching(criteria);

    return new BooksResponse(books);
  }
}
