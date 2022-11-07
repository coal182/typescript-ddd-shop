import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';

import { TYPES } from '@constants/types';
import { IQueryBus } from '@core/i-query-bus';
import { BooksResponse } from '@storeback/book/application/books-response';
import { SearchBooksByCriteriaQuery } from '@storeback/book/application/queries/search-books-by-criteria-query';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';

import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

type FilterType = { value: string; operator: string; field: string };

@controller('/api/v1/books', verifyJWT_MW)
export class BookController {
  constructor(
    @inject(TYPES.BookReadModelFacade) private readonly readmodel: IBookReadModelFacade,
    @inject(TYPES.QueryBus) private readonly queryBus: IQueryBus
  ) {}
  /*
  @httpGet('/')
  async getAllBooks(@request() req: Request, @response() res: Response) {
    const query = req.query || {};
    const name = query.name || '';
    if (name) {
      const books = await this.readmodel.getByName(name.toString());
      return res.json(ok('Successfully retrieved all books', books));
    } else {
      const books = await this.readmodel.getAll();
      return res.json(ok('Successfully retrieved all books', books));
    }
  }
*/
  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const book = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the book', book));
  }

  //http://127.0.0.1:3000/api/v1/books/?filters[0][field]=name&filters[0][operator]=CONTAINS&filters[0][value]=War&orderBy=name&order=asc&limit=5&offset=0
  @httpGet('/')
  async getByCriteria(@request() req: Request, @response() res: Response) {
    const { query: queryParams } = req;
    const { filters, orderBy, order, limit, offset } = queryParams;

    const query = new SearchBooksByCriteriaQuery(
      this.parseFilters(filters as Array<FilterType>),
      orderBy as string,
      order as string,
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined
    );

    const response = await this.queryBus.ask<BooksResponse>(query);

    return res.json(ok('Successfully retrieve the books', response.books));
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
