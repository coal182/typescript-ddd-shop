import { inject, injectable } from 'inversify';

import { UpdateBookImageCommand } from '@commands/book/UpdateBookImage';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { IBookRepository } from '@domain/book/IBookRepository';

@injectable()
export class UpdateBookImageCommandHandler implements ICommandHandler<UpdateBookImageCommand> {
  public static commandToHandle: string = UpdateBookImageCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookImageCommand) {
    const book = await this.repository.getById(command.guid);
    console.log(book);
    book.changeImage(command.image);
    await this.repository.save(book, command.originalVersion);
  }
}
