import { Criteria } from '@shared/domain/criteria/Criteria';
import { Filters } from '@shared/domain/criteria/Filters';
import { Order } from '@shared/domain/criteria/Order';

import { BookRepository } from '../../domain/BookRepository';
import { BooksResponse } from '../books-response';

export class BooksByCriteriaSearcher {
  constructor(private repository: BookRepository) {}

  async run(filters: Filters, order: Order, limit?: number, offset?: number): Promise<BooksResponse> {
    const criteria = new Criteria(filters, order, limit, offset);

    const books = await this.repository.matching(criteria);

    return new BooksResponse(books);
  }
}
