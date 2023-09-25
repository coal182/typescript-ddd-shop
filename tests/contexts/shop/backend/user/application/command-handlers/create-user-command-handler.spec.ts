import { expect } from 'chai';
import { SinonFakeTimers, createSandbox } from 'sinon';

import { CreateUserCommand } from '@shop-backend/user/application/commands/create-user';
import { UserCreator } from '@shop-backend/user/application/create/user-creator';
import { UserCreated } from '@shop-backend/user/domain/events/user-created';
import { InvalidUserEmail } from '@shop-backend/user/domain/invalid-user-email';
import { User } from '@shop-backend/user/domain/user';
import { CreateUserCommandHandler } from 'src/contexts/shop/user/application/command-handlers/create-user-command-handler';
import EventBusMock from 'tests/contexts/shared/domain/event-bus-mock';

import { UserEventStoreMock } from '../../__mocks__/user-event-store-mock';
import { UserMother } from '../../domain/user-mother';
import { UserCreatedDomainEventMother } from '../event-handlers/user-created-domain-event-mother';

import { CreateUserCommandMother } from './create-user-command-mother';

describe(CreateUserCommandHandler.name, () => {
  const sandbox = createSandbox();
  let clock: SinonFakeTimers;
  let eventStore: UserEventStoreMock;
  let creator: UserCreator;
  let eventBus: EventBusMock;
  let handler: CreateUserCommandHandler;

  beforeEach(() => {
    clock = sandbox.useFakeTimers(new Date());
    eventStore = new UserEventStoreMock();
    eventBus = new EventBusMock();
    creator = new UserCreator(eventBus, eventStore);
    handler = new CreateUserCommandHandler(creator);
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  describe('when asked to handle a command', () => {
    let command: CreateUserCommand;
    let user: User;
    let domainEvent: UserCreated;

    beforeEach(() => {
      command = CreateUserCommandMother.random();
      user = UserMother.from(command);
      domainEvent = UserCreatedDomainEventMother.fromUser(user);
    });

    it('should save the event on event store and publish it', async () => {
      await handler.handle(command);
      eventStore.assertSaveHaveBeenCalledWith([domainEvent]);
      eventBus.assertLastPublishedEventIs(domainEvent);
    });

    it('should throw an error if the user email is invalid', async () => {
      const invalidCommand = CreateUserCommandMother.invalidEmail();
      await expect(handler.handle(invalidCommand)).to.eventually.be.rejectedWith(InvalidUserEmail);
    });
  });
});
