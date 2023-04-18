import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { QueryBus } from '@shared/domain/QueryBus';
import { BooksResponse } from '@storeback/book/application/books-response';
import { SearchBooksByCriteriaQuery } from '@storeback/book/application/SearchByCriteria/search-books-by-criteria-query';

type FilterType = { value: string; operator: string; field: string };

export class BookGetByCriteriaController {
  constructor(private readonly queryBus: QueryBus) {}

  async run(_req: Request, res: Response) {
    const { query: queryParams } = _req;
    const { filters, orderBy, order, limit, offset } = queryParams;
    console.log('📌 ~ queryParams:', queryParams);

    const query = new SearchBooksByCriteriaQuery(
      this.parseFilters(filters as Array<FilterType>),
      orderBy as string,
      order as string,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );

    const response = await this.queryBus.ask<BooksResponse>(query);

    res.status(httpStatus.OK).send(response.books);
  }

  private parseFilters(params: Array<FilterType>): Array<Map<string, string>> {
    if (!params) {
      return new Array<Map<string, string>>();
    }

    return params.map((filter) => {
      const field = filter.field;
      const value = filter.value;
      const operator = filter.operator;

      return new Map([
        ['field', field],
        ['operator', operator],
        ['value', value],
      ]);
    });
  }
}
