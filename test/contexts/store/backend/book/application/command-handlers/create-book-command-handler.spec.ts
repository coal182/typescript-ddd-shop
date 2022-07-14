import 'reflect-metadata';
import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { Book } from '@storeback/book/domain/book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';

import { BookEventStoreMock } from '../../__mocks__/book-event-store-mock';
import { BookRepositoryMock } from '../../__mocks__/book-repository-mock';

describe(CreateBookCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new BookEventStoreMock();
  const repository = new BookRepositoryMock(eventStoreMock);
  const commandHandler = new CreateBookCommandHandler(repository);

  describe('when asked to handle a command', () => {
    it('should save the event on repository', () => {
      const command = new CreateBookCommand('guid', 'name', 'description', 'image', 'authorId', 20);
      commandHandler.handle(command);
      const expectedAggregateRoot = new Book(
        'guid',
        new BookName('name'),
        new BookDescription('description'),
        new BookImage('image'),
        new BookAuthor('authorId'),
        new BookPrice(20)
      );
      const expectedVersion = -1;
      //expect(repository.getById('guid')).to.be.instanceof(Book);
      repository.assertSaveHasBeenCalledWith(expectedAggregateRoot, expectedVersion);
    });
  });
});
