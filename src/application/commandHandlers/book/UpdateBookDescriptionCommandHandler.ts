import { inject, injectable } from 'inversify';

import { UpdateBookDescriptionCommand } from '@commands/book/UpdateBookDescription';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { IBookRepository } from '@domain/book/IBookRepository';

@injectable()
export class UpdateBookDescriptionCommandHandler implements ICommandHandler<UpdateBookDescriptionCommand> {
  public static commandToHandle: string = UpdateBookDescriptionCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookDescriptionCommand) {
    const book = await this.repository.getById(command.guid);
    book.changeDescription(command.description);
    await this.repository.save(book, command.originalVersion);
  }
}
