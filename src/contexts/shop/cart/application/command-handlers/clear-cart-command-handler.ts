import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {NotFoundException} from '@shared/domain/errors/application-error';
import {EventBus} from '@shared/domain/event-bus';
import {CartEventStore} from '@shop-backend/cart/domain/cart-event-store';
import {CartId} from '@shop-backend/cart/domain/cart-id';
import {Cart} from 'src/contexts/shop/cart/domain/cart';

import {ClearCartCommand} from '../commands/clear-cart';

export class ClearCartCommandHandler implements CommandHandler<ClearCartCommand> {
    constructor(
        private eventBus: EventBus,
        private readonly eventStore: CartEventStore,
    ) {}

    subscribedTo(): Command {
        return ClearCartCommand;
    }

    async handle(command: ClearCartCommand): Promise<void> {
        const id = new CartId(command.id);

        const events = await this.eventStore.findByAggregateId(id);
        if (!events) {
            throw new NotFoundException('Cart not found by its id');
        }

        const order = Cart.initialize(id);
        order.loadFromHistory(events);
        order.clear();
        const newDomainEvents = order.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
