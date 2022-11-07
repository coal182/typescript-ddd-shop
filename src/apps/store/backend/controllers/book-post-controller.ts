import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, request, response, httpPost } from 'inversify-express-utils';
import { v4 as uuidv4 } from 'uuid';

import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/command-bus';
import { BookCreator } from '@storeback/book/application/book-creator';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';
import { addIdIfNotExists, getRandomFloat } from 'test/shared/utils/utils';

import { verifyJWT_MW } from '../middlewares/auth';
import { ok } from '../processors/response';

type BookPostRequest = Request & {
  body: {
    id?: string;
    name: string;
    description: string;
    image: string;
    author: string;
    price: number;
  };
};

@controller('/api/v1/books', verifyJWT_MW)
export class BookPostController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.BookReadModelFacade) private readonly readmodel: IBookReadModelFacade,
    @inject(TYPES.BookCreator) private readonly bookCreator: BookCreator
  ) {}

  @httpPost('/')
  async createBook(@request() req: BookPostRequest, @response() res: Response) {
    const { id, name, description, image, author, price } = addIdIfNotExists(req.body);

    await this.bookCreator.run({ id, name, description, image, author, price });
    return res.json(ok('Successfully created the book', undefined));
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
        getRandomFloat(9, 40, 2)
      );
      this.commandBus.send(command);
    });

    return res.json(ok('Successfully created the book', undefined));
  }
}
