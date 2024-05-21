import {EventBus} from '@shared/domain/event-bus';
import {User} from '@shop-backend/user/domain/user';
import {UserBirthdate} from '@shop-backend/user/domain/user-birthdate';
import {UserEmail} from '@shop-backend/user/domain/user-email';
import {UserEventStore} from '@shop-backend/user/domain/user-event-store';
import {UserFirstname} from '@shop-backend/user/domain/user-firstname';
import {UserId} from '@shop-backend/user/domain/user-id';
import {UserLastname} from '@shop-backend/user/domain/user-lastname';
import {UserPassword} from '@shop-backend/user/domain/user-password';

export class UserCreator {
    constructor(
        private eventBus: EventBus,
        private eventStore: UserEventStore,
    ) {}

    async run(params: {
        id: UserId;
        email: UserEmail;
        firstname: UserFirstname;
        lastname: UserLastname;
        dateOfBirth: UserBirthdate;
        password: UserPassword;
    }): Promise<void> {
        const product = User.create(params.id, params.email, params.firstname, params.lastname, params.dateOfBirth, params.password);

        const newDomainEvents = product.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
