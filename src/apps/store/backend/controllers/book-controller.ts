import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response, httpPost, httpPut } from 'inversify-express-utils';
import { v4 as uuidv4 } from 'uuid';

import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/command-bus';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { UpdateBookAuthorCommand } from '@storeback/book/application/commands/update-book-author';
import { UpdateBookDescriptionCommand } from '@storeback/book/application/commands/update-book-description';
import { UpdateBookImageCommand } from '@storeback/book/application/commands/update-book-image';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';

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
    let id = uuidv4();
    if (req.body.id) {
      id = req.body.id;
    }
    const command = new CreateBookCommand(id, name, description, image, authorId, price);
    await this.commandBus.send(command);
    return res.json(ok('Successfully created the book', undefined));
  }

  @httpPut('/:id/author')
  async updateAuthor(@request() req: Request, @response() res: Response) {
    const { authorId, version } = req.body;
    const command = new UpdateBookAuthorCommand(req.params.id, authorId, version);
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

  @httpPost('/batch')
  async getBatch(@request() req: Request, @response() res: Response) {
    const { books } = req.body;

    const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus semper vulputate. 
      In id ex ac urna dictum feugiat aliquam sit amet lorem. Nunc ut eleifend massa, at ultrices nunc. 
      Aenean dignissim luctus magna non egestas. Praesent feugiat turpis sed tristique elementum. 
      Quisque pharetra imperdiet erat quis facilisis. Nam dictum venenatis mi vitae aliquam. 
      Morbi ac augue at nibh convallis imperdiet ac id ipsum. Etiam auctor, arcu in iaculis convallis, 
      neque est scelerisque metus, eu tincidunt turpis ex quis ex. Proin at nisi a sem fringilla ultrices. 
      Pellentesque egestas iaculis sapien, a congue dolor pretium eget. Nunc at metus tellus. 
      Morbi sollicitudin placerat leo, ut viverra ante semper dignissim. 
      Duis posuere, elit quis elementum pretium, tellus justo aliquam massa, quis iaculis metus purus non neque. 
      Maecenas bibendum efficitur blandit. Aenean egestas malesuada elit sit amet bibendum.`;

    books.results.forEach((book: any) => {
      const id = uuidv4();

      const command = new CreateBookCommand(
        id,
        book.title,
        description,
        book['formats']['image/jpeg'].replace('small', 'medium'),
        'r9n16bJtQlpxxrTTThEKn',
        this.getRandomFloat(9, 40, 2)
      );
      this.commandBus.send(command);
    });

    return res.json(ok('Successfully created the book', undefined));
  }

  getRandomFloat(min: number, max: number, decimals: number) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
  }
}
