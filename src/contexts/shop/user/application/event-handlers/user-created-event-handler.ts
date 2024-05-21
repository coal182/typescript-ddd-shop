import {DomainEventClass} from '@shared/domain/domain-event';
import {DomainEventSubscriber} from '@shared/domain/domain-event-subscriber';
import {User} from '@shop-backend/user/domain/user';
import {UserBirthdate} from '@shop-backend/user/domain/user-birthdate';
import {UserEmail} from '@shop-backend/user/domain/user-email';
import {UserFirstname} from '@shop-backend/user/domain/user-firstname';
import {UserId} from '@shop-backend/user/domain/user-id';
import {UserLastname} from '@shop-backend/user/domain/user-lastname';
import {UserPassword} from '@shop-backend/user/domain/user-password';
import {UserRepository} from '@shop-backend/user/domain/user-repository';
import {UserCreated} from 'src/contexts/shop/user/domain/events/user-created';

export class UserCreatedEventHandler implements DomainEventSubscriber<UserCreated> {
    public event = UserCreated.name;

    constructor(private repository: UserRepository) {}

    subscribedTo(): DomainEventClass[] {
        return [UserCreated];
    }

    async on(domainEvent: UserCreated): Promise<void> {
        const id = new UserId(domainEvent.aggregateId);
        const email = new UserEmail(domainEvent.email);
        const firstname = new UserFirstname(domainEvent.firstname);
        const lastname = new UserLastname(domainEvent.lastname);
        const dateOfBirth = new UserBirthdate(new Date(domainEvent.dateOfBirth));
        const password = new UserPassword(domainEvent.password);

        const product = new User(id, email, firstname, lastname, dateOfBirth, password);
        await this.repository.save(product);
    }
}
