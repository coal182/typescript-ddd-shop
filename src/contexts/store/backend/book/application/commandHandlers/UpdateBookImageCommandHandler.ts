import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { BookImage } from '@storeback/book/domain/BookImage';
import { IBookRepository } from '@storeback/book/domain/IBookRepository';
import { UpdateBookImageCommand } from 'contexts/store/backend/book/application/commands/UpdateBookImage';

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
