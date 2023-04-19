import { Command } from '@shared/domain/Command';
import { CommandHandler } from '@shared/domain/CommandHandler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookId } from '@storeback/book/domain/book-id';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';

import { BookCreator } from '../create/book-creator';

export class CreateBookCommandHandler implements CommandHandler<CreateBookCommand> {
  constructor(private bookCreator: BookCreator) {}

  subscribedTo(): Command {
    return CreateBookCommand;
  }

  async handle(command: CreateBookCommand): Promise<void> {
    const id = new BookId(command.id);
    const name = new BookName(command.name);
    const description = new BookDescription(command.description);
    const image = new BookImage(command.image);
    const author = new BookAuthor(command.author);
    const price = new BookPrice(command.price);
    await this.bookCreator.run({ id, name, description, image, author, price });
  }
}
