import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { CommandBus } from '@shared/domain/CommandBus';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';

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

export class BookPostController {
  constructor(private commandBus: CommandBus) {}

  async run(req: Request<BookPostRequest>, res: Response) {
    try {
      const { id, name, description, image, authorId: author, price } = req.body;
      console.log('📌 ~ req.body:', req.body);
      const createCourseCommand = new CreateBookCommand(id, name, description, image, author, price);
      await this.commandBus.dispatch(createCourseCommand);

      res.status(httpStatus.CREATED).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  // async getBatch(req: Request, res: Response) {
  //   const { books } = req.body;

  //   const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus semper vulputate.
  //     In id ex ac urna dictum feugiat aliquam sit amet lorem. Nunc ut eleifend massa, at ultrices nunc.
  //     Aenean dignissim luctus magna non egestas. Praesent feugiat turpis sed tristique elementum.
  //     Quisque pharetra imperdiet erat quis facilisis. Nam dictum venenatis mi vitae aliquam.
  //     Morbi ac augue at nibh convallis imperdiet ac id ipsum. Etiam auctor, arcu in iaculis convallis,
  //     neque est scelerisque metus, eu tincidunt turpis ex quis ex. Proin at nisi a sem fringilla ultrices.
  //     Pellentesque egestas iaculis sapien, a congue dolor pretium eget. Nunc at metus tellus.
  //     Morbi sollicitudin placerat leo, ut viverra ante semper dignissim.
  //     Duis posuere, elit quis elementum pretium, tellus justo aliquam massa, quis iaculis metus purus non neque.
  //     Maecenas bibendum efficitur blandit. Aenean egestas malesuada elit sit amet bibendum.`;

  //   books.results.forEach((book: any) => {
  //     const id = uuidv4();

  //     const command = new CreateBookCommand(
  //       id,
  //       book.title,
  //       description,
  //       book['formats']['image/jpeg'].replace('small', 'medium'),
  //       'r9n16bJtQlpxxrTTThEKn',
  //       getRandomFloat(9, 40, 2)
  //     );
  //     this.commandBus.send(command);
  //   });

  //   return res.json(ok('Successfully created the book', undefined));
  // }
}
