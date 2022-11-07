import 'reflect-metadata';

import { expect } from 'chai';

import { IEventStore } from '@core/i-event-store';
import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';
import { UpdateBookImageCommandHandler } from '@storeback/book/application/command-handlers/update-book-image-command-handler';
import { CreateBookCommand } from '@storeback/book/application/commands/create-book';
import { UpdateBookImageCommand } from '@storeback/book/application/commands/update-book-image';

import { BookEventStoreMock } from '../../__mocks__/book-event-store-mock';
import { BookRepositoryMock } from '../../__mocks__/book-repository-mock';
import { BookImageMother } from '../../domain/book-image-mother';
import { BookMother } from '../../domain/book-mother';

describe(UpdateBookImageCommandHandler.name, () => {
  const eventStoreMock: IEventStore = new BookEventStoreMock();
  const repository = new BookRepositoryMock(eventStoreMock);
  const commandHandler = new CreateBookCommandHandler(repository);
  const updateCommandHandler = new UpdateBookImageCommandHandler(repository);

  describe('when a book exists', () => {
    const expectedAggregateRoot = BookMother.random();
    const updatedImage = BookImageMother.random();

    before(() => {
      const command = new CreateBookCommand(
        expectedAggregateRoot.guid.value,
        expectedAggregateRoot.name.value,
        expectedAggregateRoot.description.value,
        expectedAggregateRoot.image.value,
        expectedAggregateRoot.author.value,
        expectedAggregateRoot.price.value
      );

      commandHandler.handle(command);
    });

    describe('and asked to update his image', () => {
      before(() => {
        const updateCommand = new UpdateBookImageCommand(expectedAggregateRoot.guid.value, updatedImage.value, 0);
        updateCommandHandler.handle(updateCommand);
      });

      it('should save the two events on repository', () => {
        repository.assertSaveHasBeenCalledTwice;
      });

      it('should update the image', async () => {
        const savedAggregate = await repository.getById(expectedAggregateRoot.guid.value);
        expect(savedAggregate.image.value).not.to.be.equal(expectedAggregateRoot.image);
        expect(savedAggregate.image.value).to.be.equal(updatedImage.value);
      });
    });
  });
});
