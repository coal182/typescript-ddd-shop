import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, request, response, httpPut } from 'inversify-express-utils';

import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/command-bus';
import { UpdateBookAuthorCommand } from '@storeback/book/application/commands/update-book-author';
import { UpdateBookDescriptionCommand } from '@storeback/book/application/commands/update-book-description';
import { UpdateBookImageCommand } from '@storeback/book/application/commands/update-book-image';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';

import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

@controller('/api/v1/books', verifyJWT_MW)
export class BookPutController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.BookReadModelFacade) private readonly readmodel: IBookReadModelFacade
  ) {}

  @httpPut('/:id/author')
  async updateAuthor(@request() req: Request, @response() res: Response) {
    const { author, version } = req.body;
    const command = new UpdateBookAuthorCommand(req.params.id, author, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:id/description')
  async updateDescription(@request() req: Request, @response() res: Response) {
    const { description, version } = req.body;
    const command = new UpdateBookDescriptionCommand(req.params.id, description, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:id/image')
  async updateImage(@request() req: Request, @response() res: Response) {
    const { image, version } = req.body;
    const command = new UpdateBookImageCommand(req.params.id, image, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }
}
