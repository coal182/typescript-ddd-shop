import { inject, injectable } from 'inversify';

import { CreateBookCommand } from '@commands/book/CreateBook';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { Book } from '@domain/book/Book';
import { BookAuthor } from '@domain/book/BookAuthor';
import { BookDescription } from '@domain/book/BookDescription';
import { BookId } from '@domain/book/BookId';
import { BookImage } from '@domain/book/BookImage';
import { BookName } from '@domain/book/BookName';
import { BookPrice } from '@domain/book/BookPrice';
import { IBookRepository } from '@domain/book/IBookRepository';

@injectable()
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {
  public static commandToHandle: string = CreateBookCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: CreateBookCommand) {
    const book = new Book(
      command.guid,
      new BookName(command.name),
      new BookDescription(command.description),
      new BookImage(command.image),
      new BookAuthor(command.authorId),
      new BookPrice(command.price)
    );
    this.repository.save(book, -1);
  }
}
