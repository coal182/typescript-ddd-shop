import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response, httpPost, httpPut } from 'inversify-express-utils';

import { CreateBookCommand } from '@commands/book/CreateBook';
import { UpdateBookAuthorCommand } from '@commands/book/UpdateBookAuthor';
import { UpdateBookDescriptionCommand } from '@commands/book/UpdateBookDescription';
import { UpdateBookImageCommand } from '@commands/book/UpdateBookImage';
import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/commandBus';

import { IBookReadModelFacade } from '../../../application/projection/book/ReadModel';
import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/books', verifyJWT_MW)
export class BookController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.BookReadModelFacade) private readonly readmodel: IBookReadModelFacade
  ) {}

  @httpGet('/')
  async getAllBooks(@request() req: Request, @response() res: Response) {
    console.log(req.query);
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

  @httpPost('/')
  async createBook(@request() req: Request, @response() res: Response) {
    const { name, description, image, authorId, price } = req.body;
    const command = new CreateBookCommand(name, description, image, authorId, price);
    await this.commandBus.send(command);
    return res.json(ok('Successfully created the book', undefined));
  }

  @httpPut('/:guid/author')
  async updateAuthor(@request() req: Request, @response() res: Response) {
    const { authorId, version } = req.body;
    const command = new UpdateBookAuthorCommand(req.params.guid, authorId, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:guid/description')
  async updateDescription(@request() req: Request, @response() res: Response) {
    const { description, version } = req.body;
    const command = new UpdateBookDescriptionCommand(req.params.guid, description, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:guid/image')
  async updateImage(@request() req: Request, @response() res: Response) {
    const { image, version } = req.body;
    const command = new UpdateBookImageCommand(req.params.guid, image, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }
}
