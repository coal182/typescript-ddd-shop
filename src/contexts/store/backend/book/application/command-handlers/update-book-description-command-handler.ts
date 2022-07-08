import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { UpdateBookDescriptionCommand } from '@storeback/book/application/commands/update-book-description';
import { BookDescription } from '@storeback/book/domain/book-description';
import { IBookRepository } from '@storeback/book/domain/i-book-repository';

@injectable()
export class UpdateBookDescriptionCommandHandler implements ICommandHandler<UpdateBookDescriptionCommand> {
  public static commandToHandle: string = UpdateBookDescriptionCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookDescriptionCommand) {
    const book = await this.repository.getById(command.guid);
    book.changeDescription(new BookDescription(command.description));
    await this.repository.save(book, command.originalVersion);
  }
}
