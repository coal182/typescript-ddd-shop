import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { UpdateBookAuthorCommand } from '@storeback/book/application/commands/UpdateBookAuthor';
import { BookAuthor } from '@storeback/book/domain/BookAuthor';
import { IBookRepository } from '@storeback/book/domain/IBookRepository';

@injectable()
export class UpdateBookAuthorCommandHandler implements ICommandHandler<UpdateBookAuthorCommand> {
  public static commandToHandle: string = UpdateBookAuthorCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookAuthorCommand) {
    const book = await this.repository.getById(command.guid);
    book.changeAuthor(new BookAuthor(command.authorId));
    await this.repository.save(book, command.originalVersion);
  }
}
