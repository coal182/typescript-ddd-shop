import {Command} from '@shared/domain/command';
import {CommandHandler} from '@shared/domain/command-handler';
import {NotFoundException} from '@shared/domain/errors/application-error';
import {EventBus} from '@shared/domain/event-bus';
import {CartEventStore} from '@shop-backend/cart/domain/cart-event-store';
import {CartId} from '@shop-backend/cart/domain/cart-id';
import {AddItemToCartCommand} from 'src/contexts/shop/cart/application/commands/add-item-to-cart';
import {Cart} from 'src/contexts/shop/cart/domain/cart';
import {CartItem} from 'src/contexts/shop/cart/domain/cart-item';

export class AddItemToCartCommandHandler implements CommandHandler<AddItemToCartCommand> {
    constructor(
        private eventBus: EventBus,
        private readonly eventStore: CartEventStore,
    ) {}

    subscribedTo(): Command {
        return AddItemToCartCommand;
    }

    async handle(command: AddItemToCartCommand): Promise<void> {
        const id = new CartId(command.id);
        const item = new CartItem(command.productId, command.qty, command.price);

        const events = await this.eventStore.findByAggregateId(id);
        if (!events) {
            throw new NotFoundException('Cart not found by its id');
        }

        const cart = Cart.initialize(id);
        cart.loadFromHistory(events);
        cart.addItem(item);
        const newDomainEvents = cart.pullDomainEvents();
        await this.eventStore.save(newDomainEvents);
        await this.eventBus.publish(newDomainEvents);
    }
}
