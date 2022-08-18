import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';

import { TYPES } from '@constants/types';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';

import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/books', verifyJWT_MW)
export class BookController {
  constructor(@inject(TYPES.BookReadModelFacade) private readonly readmodel: IBookReadModelFacade) {}

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

  @httpGet('/:guid')
  async getById(@request() req: Request, @response() res: Response) {
    const book = await this.readmodel.getById(req.params.guid);
    return res.json(ok('Successfully retrieve the book', book));
  }
}
