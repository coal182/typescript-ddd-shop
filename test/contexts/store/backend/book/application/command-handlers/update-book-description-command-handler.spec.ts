import 'reflect-metadata';

import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';
import { UpdateBookDescriptionCommandHandler } from '@storeback/book/application/command-handlers/update-book-description-command-handler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { UpdateBookDescriptionCommand } from '@storeback/book/application/commands/update-book-description';

import { BookEventStoreMock } from '../../__mocks__/book-event-store-mock';
import { BookRepositoryMock } from '../../__mocks__/book-repository-mock';
import { BookDescriptionMother } from '../../domain/book-description-mother';
import { BookMother } from '../../domain/book-mother';

describe(UpdateBookDescriptionCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new BookEventStoreMock();
  const repository = new BookRepositoryMock(eventStoreMock);
  const commandHandler = new CreateBookCommandHandler(repository);
  const updateCommandHandler = new UpdateBookDescriptionCommandHandler(repository);

  describe('when a book exists', () => {
    const expectedAggregateRoot = BookMother.random();
    const updatedDescription = BookDescriptionMother.random();

    before(() => {
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

    describe('and asked to update his description', () => {
      before(() => {
        const updateCommand = new UpdateBookDescriptionCommand(expectedAggregateRoot.guid, updatedDescription.value, 0);
        updateCommandHandler.handle(updateCommand);
      });

      it('should save the two events on repository', () => {
        repository.assertSaveHasBeenCalledTwice;
      });

      it('should update the description', async () => {
        const savedAggregate = await repository.getById(expectedAggregateRoot.guid);
        expect(savedAggregate.description.value).not.to.be.equal(expectedAggregateRoot.description);
        expect(savedAggregate.description.value).to.be.equal(updatedDescription.value);
      });
    });
  });
});
