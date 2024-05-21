import {UserCreatedEventHandler} from '@shop-backend/user/application/event-handlers/user-created-event-handler';
import {SinonFakeTimers, createSandbox} from 'sinon';

import {UserCreatedDomainEventMother} from './user-created-domain-event-mother';

import {UserRepositoryMock} from '../../__mocks__/user-repository-mock';
import {UserMother} from '../../domain/user-mother';
import {CreateUserCommandMother} from '../command-handlers/create-user-command-mother';

describe(UserCreatedEventHandler.name, () => {
    const sandbox = createSandbox();
    let repository: UserRepositoryMock;
    let handler: UserCreatedEventHandler;
    let clock: SinonFakeTimers;

    beforeEach(() => {
        clock = sandbox.useFakeTimers(new Date());
        repository = new UserRepositoryMock();
        handler = new UserCreatedEventHandler(repository);
    });

    afterEach(() => {
        clock.restore();
        sandbox.restore();
    });

    it('should project a valid user on repository', async () => {
        const command = CreateUserCommandMother.random();
        const user = UserMother.from(command);
        const event = UserCreatedDomainEventMother.fromUser(user);
        await handler.on(event);
        repository.assertSaveHaveBeenCalledWith(user);
    });
});
