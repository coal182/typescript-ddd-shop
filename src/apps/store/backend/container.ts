import { Container } from 'inversify';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import config from '@config/main';
import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { Command } from '@core/command';
import { ICommandHandler } from '@core/i-command-handler';
import { IEventBus } from '@core/i-event-bus';
import { IEventHandler } from '@core/i-event-handler';
import { IEventStore } from '@core/i-event-store';
import { CommandBus } from '@infrastructure/command-bus';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { RedisEventBus } from '@infrastructure/event-bus/redis';
import { getRedisClient } from '@infrastructure/redis';
import { AuthorCreatedEventHandler } from '@storeback/author/application/event-handlers/author-created-event-handler';
import {
  AuthorReadModelFacade,
  IAuthorReadModelFacade,
} from '@storeback/author/infrastructure/projection/authors/read-model';
import { CreateBookCommandHandler } from '@storeback/book/application/command-handlers/create-book-command-handler';
import { UpdateBookAuthorCommandHandler } from '@storeback/book/application/command-handlers/update-book-author-command-handler';
import { UpdateBookDescriptionCommandHandler } from '@storeback/book/application/command-handlers/update-book-description-command-handler';
import { UpdateBookImageCommandHandler } from '@storeback/book/application/command-handlers/update-book-image-command-handler';
import { BookAuthorChangedEventHandler } from '@storeback/book/application/event-handlers/book-author-changed-event-handler';
import { BookCreatedEventHandler } from '@storeback/book/application/event-handlers/book-created-event-handler';
import { BookDescriptionChangedEventHandler } from '@storeback/book/application/event-handlers/book-description-changed-event-handler';
import { BookImageChangedEventHandler } from '@storeback/book/application/event-handlers/book-image-changed-event-handler';
import { FakeNotificationEventHandler } from '@storeback/book/application/event-handlers/fake-notification-event-handler';
import { BookAuthorChanged } from '@storeback/book/domain/events/book-author-changed';
import { BookCreated } from '@storeback/book/domain/events/book-created';
import { BookDescriptionChanged } from '@storeback/book/domain/events/book-description-changed';
import { BookImageChanged } from '@storeback/book/domain/events/book-image-changed';
import { IBookRepository } from '@storeback/book/domain/i-book-repository';
import { BookEventStore } from '@storeback/book/infrastructure/persistence/book-event-store';
import { BookRepository } from '@storeback/book/infrastructure/persistence/book-repository';
import { BookReadModelFacade, IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/read-model';
import { AddItemToCartCommandHandler } from '@storeback/cart/application/command-handlers/add-item-to-cart-command-handler';
import { CreateCartCommandHandler } from '@storeback/cart/application/command-handlers/create-cart-command-handler';
import { RemoveItemFromCartCommandHandler } from '@storeback/cart/application/command-handlers/remove-item-from-cart-command-handler';
import { CartCreatedEventHandler } from '@storeback/cart/application/event-handlers/cart-created-event-handler';
import { CartItemAddedEventHandler } from '@storeback/cart/application/event-handlers/cart-item-added-event-handler';
import { CartItemRemovedEventHandler } from '@storeback/cart/application/event-handlers/cart-item-removed-event-handler';
import { CartCreated } from '@storeback/cart/domain/events/cart-created';
import { CartItemAdded } from '@storeback/cart/domain/events/cart-item-added';
import { CartItemRemoved } from '@storeback/cart/domain/events/cart-item-removed';
import { ICartRepository } from '@storeback/cart/domain/i-cart-repository';
import { CartEventStore } from '@storeback/cart/infrastructure/persistence/cart-event-store';
import { CartRepository } from '@storeback/cart/infrastructure/persistence/cart-repository';
import { CartReadModelFacade, ICartReadModelFacade } from '@storeback/cart/infrastructure/projection/carts/read-model';
import { CreateLoanCommandHandler } from '@storeback/loan/application/command-handlers/create-loan-command-handler';
import { LoanCreatedEventHandler } from '@storeback/loan/application/event-handlers/loan-created-event-handler';
import { LoanCreated } from '@storeback/loan/domain/events/LoanCreated';
import { ILoanRepository } from '@storeback/loan/domain/i-loan-repository';
import { LoanEventStore } from '@storeback/loan/infrastructure/persistence/loan-event-store';
import { LoanRepository } from '@storeback/loan/infrastructure/persistence/loan-repository';
import { AddLineToOrderCommandHandler } from '@storeback/order/application/command-handlers/add-line-to-order-command-handler';
import { CancelOrderCommandHandler } from '@storeback/order/application/command-handlers/cancel-order-command-handler';
import { CreateOrderCommandHandler } from '@storeback/order/application/command-handlers/create-order-command-handler';
import { InitiateOrderCommandHandler } from '@storeback/order/application/command-handlers/initiate-order-command-handler';
import { OrderCancelledEventHandler } from '@storeback/order/application/event-handlers/order-cancelled-event-handler';
import { OrderCreatedEventHandler } from '@storeback/order/application/event-handlers/order-created-event-handler';
import { OrderInitiatedEventHandler } from '@storeback/order/application/event-handlers/order-initiated-event-handler';
import { OrderLineAddedEventHandler } from '@storeback/order/application/event-handlers/order-line-added-event-handler';
import { OrderCancelled } from '@storeback/order/domain/events/order-cancelled';
import { OrderCreated } from '@storeback/order/domain/events/order-created';
import { OrderInitiated } from '@storeback/order/domain/events/order-initiated';
import { OrderLineAdded } from '@storeback/order/domain/events/order-line-added';
import { IOrderRepository } from '@storeback/order/domain/i-order-repository';
import { OrderEventStore } from '@storeback/order/infrastructure/persistence/order-event-store';
import { OrderRepository } from '@storeback/order/infrastructure/persistence/order-repository';
import {
  OrderReadModelFacade,
  IOrderReadModelFacade,
} from '@storeback/order/infrastructure/projection/orders/read-model';
import { CreateUserCommandHandler } from '@storeback/user/application/command-handlers/create-user-command-handler';
import { UpdateUserCommandHandler } from '@storeback/user/application/command-handlers/update-user-command-handler';
import { UpdateUserPasswordCommandHandler } from '@storeback/user/application/command-handlers/update-user-password-command-handler';
import { UserCreatedEventHandler } from '@storeback/user/application/event-handlers/user-created-event-handler';
import { UserPasswordChangedEventHandler } from '@storeback/user/application/event-handlers/user-password-changed-event-handler';
import { UserUpdatedEventHandler } from '@storeback/user/application/event-handlers/user-updated-event-handler';
import { UserCreated } from '@storeback/user/domain/events/user-created';
import { UserPasswordChanged } from '@storeback/user/domain/events/user-password-changed';
import { UserUpdated } from '@storeback/user/domain/events/user-updated';
import { IUserRepository } from '@storeback/user/domain/i-user-repository';
import { UserEventStore } from '@storeback/user/infrastructure/persistence/user-event-store';
import { UserRepository } from '@storeback/user/infrastructure/persistence/user-repository';
import { UserReadModelFacade, IUserReadModelFacade } from '@storeback/user/infrastructure/projection/users/read-model';

export const initialiseContainer = async () => {
  const container = new Container();
  console.log(config.MONGODB_URI);
  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);

  // Initialise Redis
  const redisSubscriber: Redis = getRedisClient(Number(config.REDIS_PORT), config.REDIS_HOST, config.REDIS_PASSWORD);
  const redis: Redis = getRedisClient(Number(config.REDIS_PORT), config.REDIS_HOST, config.REDIS_PASSWORD);
  await redisSubscriber.subscribe(...['book', 'user', 'loan', 'cart', 'order']);

  container.bind<Redis>(TYPES.RedisSubscriber).toConstantValue(redisSubscriber);
  container.bind<Redis>(TYPES.Redis).toConstantValue(redis);
  container.bind<IEventBus>(TYPES.EventBus).to(RedisEventBus);

  // Read models for query
  container.bind<IBookReadModelFacade>(TYPES.BookReadModelFacade).to(BookReadModelFacade);
  container.bind<IAuthorReadModelFacade>(TYPES.AuthorReadModelFacade).to(AuthorReadModelFacade);
  container.bind<IUserReadModelFacade>(TYPES.UserReadModelFacade).to(UserReadModelFacade);
  container.bind<ICartReadModelFacade>(TYPES.CartReadModelFacade).to(CartReadModelFacade);
  container.bind<IOrderReadModelFacade>(TYPES.OrderReadModelFacade).to(OrderReadModelFacade);

  // Event Handlers
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(FakeNotificationEventHandler);
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(BookCreatedEventHandler);
  container.bind<IEventHandler<BookAuthorChanged>>(TYPES.Event).to(BookAuthorChangedEventHandler);
  container.bind<IEventHandler<BookDescriptionChanged>>(TYPES.Event).to(BookDescriptionChangedEventHandler);
  container.bind<IEventHandler<BookImageChanged>>(TYPES.Event).to(BookImageChangedEventHandler);

  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(UserCreatedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(AuthorCreatedEventHandler);
  container.bind<IEventHandler<UserUpdated>>(TYPES.Event).to(UserUpdatedEventHandler);
  container.bind<IEventHandler<UserPasswordChanged>>(TYPES.Event).to(UserPasswordChangedEventHandler);

  container.bind<IEventHandler<CartCreated>>(TYPES.Event).to(CartCreatedEventHandler);
  container.bind<IEventHandler<CartItemAdded>>(TYPES.Event).to(CartItemAddedEventHandler);
  container.bind<IEventHandler<CartItemRemoved>>(TYPES.Event).to(CartItemRemovedEventHandler);

  container.bind<IEventHandler<OrderInitiated>>(TYPES.Event).to(OrderInitiatedEventHandler);
  container.bind<IEventHandler<OrderLineAdded>>(TYPES.Event).to(OrderLineAddedEventHandler);
  container.bind<IEventHandler<OrderCancelled>>(TYPES.Event).to(OrderCancelledEventHandler);
  container.bind<IEventHandler<OrderCreated>>(TYPES.Event).to(OrderCreatedEventHandler);

  // Prepare persistence components
  container.bind<Db>(TYPES.Db).toConstantValue(db);
  container.bind<IEventStore>(TYPES.EventStore).to(BookEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Book);
  container.bind<IEventStore>(TYPES.EventStore).to(UserEventStore).whenTargetNamed(EVENT_STREAM_NAMES.User);
  container.bind<IEventStore>(TYPES.EventStore).to(LoanEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Loan);
  container.bind<IEventStore>(TYPES.EventStore).to(CartEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Cart);
  container.bind<IEventStore>(TYPES.EventStore).to(OrderEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Order);
  container.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container.bind<ILoanRepository>(TYPES.LoanRepository).to(LoanRepository);
  container.bind<ICartRepository>(TYPES.CartRepository).to(CartRepository);
  container.bind<IOrderRepository>(TYPES.OrderRepository).to(OrderRepository);

  // Register command handlers
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateBookCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookAuthorCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookDescriptionCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookImageCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateUserCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateUserPasswordCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateUserCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateLoanCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateCartCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(AddItemToCartCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(RemoveItemFromCartCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(InitiateOrderCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateOrderCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(AddLineToOrderCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CancelOrderCommandHandler);

  // Create command bus
  const commandBus = new CommandBus();

  // Register all the command handler here
  container.getAll<ICommandHandler<Command>[]>(TYPES.CommandHandler).forEach((handler: any) => {
    commandBus.registerHandler(handler.constructor.commandToHandle, handler);
  });

  container.bind<CommandBus>(TYPES.CommandBus).toConstantValue(commandBus);

  // Event Handlers that depend on CommandBus
  container.bind<IEventHandler<LoanCreated>>(TYPES.Event).to(LoanCreatedEventHandler);

  return container;
};
