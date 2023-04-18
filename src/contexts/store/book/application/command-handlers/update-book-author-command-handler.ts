import { ICommandHandler } from '@core/i-command-handler';
import { inject, injectable } from 'inversify';

import { UpdateBookAuthorCommand } from '@storeback/book/application/commands/update-book-author';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { IBookRepository } from '@storeback/book/domain/i-book-repository';
import { TYPES } from '@storeback/shared/constants/types';

@injectable()
export class UpdateBookAuthorCommandHandler implements ICommandHandler<UpdateBookAuthorCommand> {
  public static commandToHandle: string = UpdateBookAuthorCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookAuthorCommand) {
    const book = await this.repository.getById(command.guid);
    book.changeAuthor(new BookAuthor(command.author));
    await this.repository.save(book, command.originalVersion);
  }
}
