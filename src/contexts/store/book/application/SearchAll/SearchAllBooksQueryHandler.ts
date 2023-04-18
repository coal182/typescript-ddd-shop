import { Query } from '@shared/domain/Query';
import { QueryHandler } from '@shared/domain/QueryHandler';

import { BooksResponse } from '../books-response';

import { BooksFinder } from './BooksFinder';
import { SearchAllBooksQuery } from './SearchAllBooksQuery';

export class SearchAllBooksQueryHandler implements QueryHandler<SearchAllBooksQuery, BooksResponse> {
  constructor(private readonly booksFinder: BooksFinder) {}

  subscribedTo(): Query {
    return SearchAllBooksQuery;
  }

  async handle(): Promise<BooksResponse> {
    return new BooksResponse(await this.booksFinder.run());
  }
}
