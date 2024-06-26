import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {NotFoundException} from '@shared/domain/errors/application-error';
import {EventBus} from '@shared/domain/event-bus';
import {User} from '@shop-backend/user/domain/user';
import {UserBirthdate} from '@shop-backend/user/domain/user-birthdate';
import {UserEmail} from '@shop-backend/user/domain/user-email';
import {UserEventStore} from '@shop-backend/user/domain/user-event-store';
import {UserFirstname} from '@shop-backend/user/domain/user-firstname';
import {UserId} from '@shop-backend/user/domain/user-id';
import {UserLastname} from '@shop-backend/user/domain/user-lastname';
import {UpdateUserCommand} from 'src/contexts/shop/user/application/commands/update-user';

export class UpdateUserCommandHandler implements CommandHandler<UpdateUserCommand> {
    constructor(
        private eventBus: EventBus,
        private eventStore: UserEventStore,
    ) {}

    subscribedTo(): Command {
        return UpdateUserCommand;
    }

    async handle(command: UpdateUserCommand): Promise<void> {
        const id = new UserId(command.id);
        const email = new UserEmail(command.email);
        const firstname = new UserFirstname(command.firstname);
        const lastname = new UserLastname(command.lastname);
        const dateOfBirth = new UserBirthdate(command.dateOfBirth);

        const events = await this.eventStore.findByAggregateId(id);
        if (!events) {
            throw new NotFoundException('User not found by its id');
        }

        const user = User.initialize(id);
        user.loadFromHistory(events);
        user.updateUser(email, firstname, lastname, dateOfBirth);
        const newDomainEvents = user.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
