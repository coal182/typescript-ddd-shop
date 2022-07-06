import '@interfaces/http/controllers';

import cors from 'cors';
import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import config from '@config/main';
import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { Command } from '@core/Command';
import { ICommandHandler } from '@core/ICommandHandler';
import { IEventBus } from '@core/IEventBus';
import { IEventHandler } from '@core/IEventHandler';
import { IEventStore } from '@core/IEventStore';
import { CommandBus } from '@infrastructure/commandBus';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { RedisEventBus } from '@infrastructure/eventbus/redis';
import { getRedisClient } from '@infrastructure/redis';
import { errorHandler } from '@interfaces/http/middlewares/ErrorHandler';
import { AuthorCreatedEventHandler } from '@storeback/author/application/eventHandlers/AuthorCreatedEventHandler';
import {
  AuthorReadModelFacade,
  IAuthorReadModelFacade,
} from '@storeback/author/infrastructure/projection/authors/ReadModel';
import { CreateBookCommandHandler } from '@storeback/book/application/commandHandlers/CreateBookCommandHandler';
import { UpdateBookAuthorCommandHandler } from '@storeback/book/application/commandHandlers/UpdateBookAuthorCommandHandler';
import { UpdateBookDescriptionCommandHandler } from '@storeback/book/application/commandHandlers/UpdateBookDescriptionCommandHandler';
import { UpdateBookImageCommandHandler } from '@storeback/book/application/commandHandlers/UpdateBookImageCommandHandler';
import { BookAuthorChangedEventHandler } from '@storeback/book/application/eventHandlers/BookAuthorChangedEventHandler';
import { BookCreatedEventHandler } from '@storeback/book/application/eventHandlers/BookCreatedEventHandler';
import { BookDescriptionChangedEventHandler } from '@storeback/book/application/eventHandlers/BookDescriptionChangedEventHandler';
import { BookImageChangedEventHandler } from '@storeback/book/application/eventHandlers/BookImageChangedEventHandler';
import { FakeNotificationEventHandler } from '@storeback/book/application/eventHandlers/FakeNotificationEventHandler';
import { BookAuthorChanged } from '@storeback/book/domain/events/BookAuthorChanged';
import { BookCreated } from '@storeback/book/domain/events/BookCreated';
import { BookDescriptionChanged } from '@storeback/book/domain/events/BookDescriptionChanged';
import { BookImageChanged } from '@storeback/book/domain/events/BookImageChanged';
import { IBookRepository } from '@storeback/book/domain/IBookRepository';
import { BookEventStore } from '@storeback/book/infrastructure/persistence/BookEventStore';
import { BookRepository } from '@storeback/book/infrastructure/persistence/BookRepository';
import { BookReadModelFacade, IBookReadModelFacade } from '@storeback/book/infrastructure/projection/books/ReadModel';
import { AddItemToCartCommandHandler } from '@storeback/cart/application/commandHandlers/AddItemToCartCommandHandler';
import { CreateCartCommandHandler } from '@storeback/cart/application/commandHandlers/CreateCartCommandHandler';
import { RemoveItemFromCartCommandHandler } from '@storeback/cart/application/commandHandlers/RemoveItemFromCartCommandHandler';
import { CartCreatedEventHandler } from '@storeback/cart/application/eventHandlers/CartCreatedEventHandler';
import { CartItemAddedEventHandler } from '@storeback/cart/application/eventHandlers/CartItemAddedEventHandler';
import { CartItemRemovedEventHandler } from '@storeback/cart/application/eventHandlers/CartItemRemovedEventHandler';
import { CartCreated } from '@storeback/cart/domain/events/CartCreated';
import { CartItemAdded } from '@storeback/cart/domain/events/CartItemAdded';
import { CartItemRemoved } from '@storeback/cart/domain/events/CartItemRemoved';
import { ICartRepository } from '@storeback/cart/domain/ICartRepository';
import { CartEventStore } from '@storeback/cart/infrastructure/persistence/CartEventStore';
import { CartRepository } from '@storeback/cart/infrastructure/persistence/CartRepository';
import { CartReadModelFacade, ICartReadModelFacade } from '@storeback/cart/infrastructure/projection/carts/ReadModel';
import { CreateLoanCommandHandler } from '@storeback/loan/application/commandHandlers/CreateLoanCommandHandler';
import { LoanCreatedEventHandler } from '@storeback/loan/application/eventHandlers/LoanCreatedEventHandler';
import { LoanCreated } from '@storeback/loan/domain/events/LoanCreated';
import { ILoanRepository } from '@storeback/loan/domain/ILoanRepository';
import { LoanEventStore } from '@storeback/loan/infrastructure/persistence/LoanEventStore';
import { LoanRepository } from '@storeback/loan/infrastructure/persistence/LoanRepository';
import { CreateUserCommandHandler } from '@storeback/user/application/commandHandlers/CreateUserCommandHandler';
import { UpdateUserCommandHandler } from '@storeback/user/application/commandHandlers/UpdateUserCommandHandler';
import { UpdateUserPasswordCommandHandler } from '@storeback/user/application/commandHandlers/UpdateUserPasswordCommandHandler';
import { UserCreatedEventHandler } from '@storeback/user/application/eventHandlers/UserCreatedEventHandler';
import { UserPasswordChangedEventHandler } from '@storeback/user/application/eventHandlers/UserPasswordChangedEventHandler';
import { UserUpdatedEventHandler } from '@storeback/user/application/eventHandlers/UserUpdatedEventHandler';
import { UserCreated } from '@storeback/user/domain/events/UserCreated';
import { UserPasswordChanged } from '@storeback/user/domain/events/UserPasswordChanged';
import { UserUpdated } from '@storeback/user/domain/events/UserUpdated';
import { IUserRepository } from '@storeback/user/domain/IUserRepository';
import { UserEventStore } from '@storeback/user/infrastructure/persistence/UserEventStore';
import { UserRepository } from '@storeback/user/infrastructure/persistence/UserRepository';
import { UserReadModelFacade, IUserReadModelFacade } from '@storeback/user/infrastructure/projection/users/ReadModel';

const initialise = async () => {
  const container = new Container();
  console.log(config.MONGODB_URI);
  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);

  // Initialise Redis
  const redisSubscriber: Redis = getRedisClient(Number(config.REDIS_PORT), config.REDIS_HOST, config.REDIS_PASSWORD);
  const redis: Redis = getRedisClient(Number(config.REDIS_PORT), config.REDIS_HOST, config.REDIS_PASSWORD);
  await redisSubscriber.subscribe(['book', 'user', 'loan', 'cart']);

  container.bind<Redis>(TYPES.RedisSubscriber).toConstantValue(redisSubscriber);
  container.bind<Redis>(TYPES.Redis).toConstantValue(redis);
  container.bind<IEventBus>(TYPES.EventBus).to(RedisEventBus);

  // Read models for query
  container.bind<IBookReadModelFacade>(TYPES.BookReadModelFacade).to(BookReadModelFacade);
  container.bind<IAuthorReadModelFacade>(TYPES.AuthorReadModelFacade).to(AuthorReadModelFacade);
  container.bind<IUserReadModelFacade>(TYPES.UserReadModelFacade).to(UserReadModelFacade);
  container.bind<ICartReadModelFacade>(TYPES.CartReadModelFacade).to(CartReadModelFacade);

  // Event Handlers
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(FakeNotificationEventHandler);
  container.bind<IEventHandler<BookAuthorChanged>>(TYPES.Event).to(BookAuthorChangedEventHandler);
  container.bind<IEventHandler<BookDescriptionChanged>>(TYPES.Event).to(BookDescriptionChangedEventHandler);
  container.bind<IEventHandler<BookImageChanged>>(TYPES.Event).to(BookImageChangedEventHandler);
  container.bind<IEventHandler<UserUpdated>>(TYPES.Event).to(UserUpdatedEventHandler);
  container.bind<IEventHandler<UserPasswordChanged>>(TYPES.Event).to(UserPasswordChangedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(UserCreatedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(AuthorCreatedEventHandler);
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(BookCreatedEventHandler);

  // Prepare persistence components
  container.bind<Db>(TYPES.Db).toConstantValue(db);
  container.bind<IEventStore>(TYPES.EventStore).to(BookEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Book);
  container.bind<IEventStore>(TYPES.EventStore).to(UserEventStore).whenTargetNamed(EVENT_STREAM_NAMES.User);
  container.bind<IEventStore>(TYPES.EventStore).to(LoanEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Loan);
  container.bind<IEventStore>(TYPES.EventStore).to(CartEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Cart);
  container.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container.bind<ILoanRepository>(TYPES.LoanRepository).to(LoanRepository);
  container.bind<ICartRepository>(TYPES.CartRepository).to(CartRepository);

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

  // Create command bus
  const commandBus = new CommandBus();

  // Register all the command handler here
  container.getAll<ICommandHandler<Command>[]>(TYPES.CommandHandler).forEach((handler: any) => {
    commandBus.registerHandler(handler.constructor.commandToHandle, handler);
  });

  container.bind<CommandBus>(TYPES.CommandBus).toConstantValue(commandBus);

  // Event Handlers that depend on CommandBus
  container.bind<IEventHandler<LoanCreated>>(TYPES.Event).to(LoanCreatedEventHandler);
  container.bind<IEventHandler<CartCreated>>(TYPES.Event).to(CartCreatedEventHandler);
  container.bind<IEventHandler<CartItemAdded>>(TYPES.Event).to(CartItemAddedEventHandler);
  container.bind<IEventHandler<CartItemRemoved>>(TYPES.Event).to(CartItemRemovedEventHandler);

  const server = new InversifyExpressServer(container);

  // Add a list of allowed origins.
  // If you have more origins you would like to add, you can add them to the array below.
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4200',
    'https://angular-pvnyyc--4200.local.webcontainer.io',
  ];

  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };

  server.setConfig((app: Application) => {
    app.use(cors(options));
    app.use(urlencoded({ extended: true }));
    app.use(json());
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  apiServer.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );

  return container;
};

export { initialise };
