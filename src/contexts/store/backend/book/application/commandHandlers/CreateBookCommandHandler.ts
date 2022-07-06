import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { CreateBookCommand } from '@storeback/book/application/commands/CreateBook';
import { Book } from '@storeback/book/domain/Book';
import { BookAuthor } from '@storeback/book/domain/BookAuthor';
import { BookDescription } from '@storeback/book/domain/BookDescription';
import { BookId } from '@storeback/book/domain/BookId';
import { BookImage } from '@storeback/book/domain/BookImage';
import { BookName } from '@storeback/book/domain/BookName';
import { BookPrice } from '@storeback/book/domain/BookPrice';
import { IBookRepository } from '@storeback/book/domain/IBookRepository';

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
