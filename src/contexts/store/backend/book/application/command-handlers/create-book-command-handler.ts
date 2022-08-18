import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { Book } from '@storeback/book/domain/book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookId } from '@storeback/book/domain/book-id';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';
import { IBookRepository } from '@storeback/book/domain/i-book-repository';

@injectable()
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {
  public static commandToHandle: string = CreateBookCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: CreateBookCommand) {
    const book = new Book({
      guid: new BookId(command.guid),
      name: new BookName(command.name),
      description: new BookDescription(command.description),
      image: new BookImage(command.image),
      authorId: new BookAuthor(command.authorId),
      price: new BookPrice(command.price),
    });
    this.repository.save(book, -1);
  }
}
