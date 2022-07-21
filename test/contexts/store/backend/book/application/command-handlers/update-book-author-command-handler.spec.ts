import 'reflect-metadata';

import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';
import { UpdateBookAuthorCommandHandler } from '@storeback/book/application/command-handlers/update-book-author-command-handler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { UpdateBookAuthorCommand } from '@storeback/book/application/commands/update-book-author';

import { BookEventStoreMock } from '../../__mocks__/book-event-store-mock';
import { BookRepositoryMock } from '../../__mocks__/book-repository-mock';
import { BookAuthorMother } from '../../domain/book-author-mother';
import { BookMother } from '../../domain/book-mother';

describe(UpdateBookAuthorCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new BookEventStoreMock();
  const repository = new BookRepositoryMock(eventStoreMock);
  const commandHandler = new CreateBookCommandHandler(repository);
  const updateCommandHandler = new UpdateBookAuthorCommandHandler(repository);

  describe('when a book exists', () => {
    const expectedAggregateRoot = BookMother.random();
    const updatedAuthor = BookAuthorMother.random();

    before(() => {
      const command = new CreateBookCommand(
        expectedAggregateRoot.guid.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.description.value,
        expectedAggregateRoot.image.value,
        expectedAggregateRoot.authorId.value,
        expectedAggregateRoot.price.value
      );

      commandHandler.handle(command);
    });

    describe('and asked to update his authorId', () => {
      before(() => {
        const updateCommand = new UpdateBookAuthorCommand(expectedAggregateRoot.guid.value, updatedAuthor.value, 0);
        updateCommandHandler.handle(updateCommand);
      });

      it('should save the two events on repository', () => {
        repository.assertSaveHasBeenCalledTwice;
      });

      it('should update the authorId', async () => {
        const savedAggregate = await repository.getById(expectedAggregateRoot.guid.value);
        expect(savedAggregate.authorId.value).not.to.be.equal(expectedAggregateRoot.authorId);
        expect(savedAggregate.authorId.value).to.be.equal(updatedAuthor.value);
      });
    });
  });
});
