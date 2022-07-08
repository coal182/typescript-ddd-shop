import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/i-command-handler';
import { UpdateBookImageCommand } from '@storeback/book/application/commands/update-book-image';
import { BookImage } from '@storeback/book/domain/book-image';
import { IBookRepository } from '@storeback/book/domain/i-book-repository';

@injectable()
export class UpdateBookImageCommandHandler implements ICommandHandler<UpdateBookImageCommand> {
  public static commandToHandle: string = UpdateBookImageCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookImageCommand) {
    const book = await this.repository.getById(command.guid);
    console.log(book);
    book.changeImage(new BookImage(command.image));
    await this.repository.save(book, command.originalVersion);
  }
}
