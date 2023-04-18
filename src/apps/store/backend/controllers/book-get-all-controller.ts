import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/QueryBus';
import { BooksResponse } from '@storeback/book/application/books-response';
import { SearchAllBooksQuery } from '@storeback/book/application/SearchAll/SearchAllBooksQuery';

export class BookGetAllController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(_req: Request, res: Response) {
    const query = new SearchAllBooksQuery();

    const response = await this.queryBus.ask<BooksResponse>(query);

    res.status(httpStatus.OK).send(response.books);
  }
}
