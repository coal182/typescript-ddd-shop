import 'reflect-metadata';
import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { Book } from '@storeback/book/domain/book';

import { BookEventStoreMock } from '../../__mocks__/book-event-store-mock';
import { BookRepositoryMock } from '../../__mocks__/book-repository-mock';
import { BookMother } from '../../domain/book-mother';

describe(CreateBookCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new BookEventStoreMock();
  const repository = new BookRepositoryMock(eventStoreMock);
  const commandHandler = new CreateBookCommandHandler(repository);

  describe('when asked to handle a command', () => {
    const expectedAggregateRoot = BookMother.random();

    beforeEach(() => {
      const command = new CreateBookCommand(
        expectedAggregateRoot.guid,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.description.value,
        expectedAggregateRoot.image.value,
        expectedAggregateRoot.authorId.value,
        expectedAggregateRoot.price.value
      );
      commandHandler.handle(command);
    });

    it('should save the event on repository', () => {
      const expectedVersion = -1;
      repository.assertSaveHasBeenCalledWith(expectedAggregateRoot, expectedVersion);
    });

    it('should be capable to get the aggregate from the events on event store', async () => {
      const savedAggregate = await repository.getById(expectedAggregateRoot.guid);
      expect(savedAggregate).to.be.instanceof(Book);
      const savedBook = (({ guid, name, description, image, authorId, price }) => ({
        guid,
        name,
        description,
        image,
        authorId,
        price,
      }))(savedAggregate);
      const expectedBook = (({ guid, name, description, image, authorId, price }) => ({
        guid,
        name,
        description,
        image,
        authorId,
        price,
      }))(expectedAggregateRoot);
      expect(savedBook).to.be.deep.equal(expectedBook);
    });
  });
});
