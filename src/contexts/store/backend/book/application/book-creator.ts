import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/command-bus';

import { CreateBookCommand } from './commands/create-book';
import { CreateBookRequest } from './create-book-request';

@injectable()
export class BookCreator {
  constructor(@inject(TYPES.CommandBus) private readonly commandBus: CommandBus) {}

  async run(request: CreateBookRequest): Promise<void> {
    const command = new CreateBookCommand(
      request.id,
      request.name,
      request.description,
      request.image,
      request.authorId,
      request.price
    );
    await this.commandBus.send(command);
  }
}
