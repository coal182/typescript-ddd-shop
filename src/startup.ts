import '@interfaces/http/controllers';

import cors from 'cors';
import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { AuthorReadModelFacade, IAuthorReadModelFacade } from '@application/projection/author/ReadModel';
import { BookReadModelFacade, IBookReadModelFacade } from '@application/projection/book/ReadModel';
import { CartReadModelFacade, ICartReadModelFacade } from '@application/projection/cart/ReadModel';
import { UserReadModelFacade, IUserReadModelFacade } from '@application/projection/user/ReadModel';
import { CreateBookCommandHandler } from '@commandHandlers/book/CreateBookCommandHandler';
import { UpdateBookAuthorCommandHandler } from '@commandHandlers/book/UpdateBookAuthorCommandHandler';
import { UpdateBookDescriptionCommandHandler } from '@commandHandlers/book/UpdateBookDescriptionCommandHandler';
import { UpdateBookImageCommandHandler } from '@commandHandlers/book/UpdateBookImageCommandHandler';
import { AddItemToCartCommandHandler } from '@commandHandlers/cart/AddItemToCartCommandHandler';
import { CreateCartCommandHandler } from '@commandHandlers/cart/CreateCartCommandHandler';
import { RemoveItemFromCartCommandHandler } from '@commandHandlers/cart/RemoveItemFromCartCommandHandler';
import { CreateLoanCommandHandler } from '@commandHandlers/loan/CreateLoanCommandHandler';
import { CreateUserCommandHandler } from '@commandHandlers/user/CreateUserCommandHandler';
import { UpdateUserCommandHandler } from '@commandHandlers/user/UpdateUserCommandHandler';
import { UpdateUserPasswordCommandHandler } from '@commandHandlers/user/UpdateUserPasswordCommandHandler';
import config from '@config/main';
import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { Command } from '@core/Command';
import { ICommandHandler } from '@core/ICommandHandler';
import { IEventBus } from '@core/IEventBus';
import { IEventHandler } from '@core/IEventHandler';
import { IEventStore } from '@core/IEventStore';
import { BookAuthorChanged } from '@domain/book/events/BookAuthorChanged';
import { BookCreated } from '@domain/book/events/BookCreated';
import { BookDescriptionChanged } from '@domain/book/events/BookDescriptionChanged';
import { BookImageChanged } from '@domain/book/events/BookImageChanged';
import { IBookRepository } from '@domain/book/IBookRepository';
import { CartCreated } from '@domain/cart/events/CartCreated';
import { CartItemAdded } from '@domain/cart/events/CartItemAdded';
import { CartItemRemoved } from '@domain/cart/events/CartItemRemoved';
import { ICartRepository } from '@domain/cart/ICartRepository';
import { LoanCreated } from '@domain/loan/events/LoanCreated';
import { ILoanRepository } from '@domain/loan/ILoanRepository';
import { UserCreated } from '@domain/user/events/UserCreated';
import { UserPasswordChanged } from '@domain/user/events/UserPasswordChanged';
import { UserUpdated } from '@domain/user/events/UserUpdated';
import { IUserRepository } from '@domain/user/IUserRepository';
import { AuthorCreatedEventHandler } from '@eventHandlers/author/AuthorCreatedEventHandler';
import { BookAuthorChangedEventHandler } from '@eventHandlers/book/BookAuthorChangedEventHandler';
import { BookCreatedEventHandler } from '@eventHandlers/book/BookCreatedEventHandler';
import { BookDescriptionChangedEventHandler } from '@eventHandlers/book/BookDescriptionChangedEventHandler';
import { BookImageChangedEventHandler } from '@eventHandlers/book/BookImageChangedEventHandler';
import { FakeNotificationEventHandler } from '@eventHandlers/book/FakeNotificationEventHandler';
import { CartCreatedEventHandler } from '@eventHandlers/cart/CartCreatedEventHandler';
import { CartItemAddedEventHandler } from '@eventHandlers/cart/CartItemAddedEventHandler';
import { CartItemRemovedEventHandler } from '@eventHandlers/cart/CartItemRemovedEventHandler';
import { LoanCreatedEventHandler } from '@eventHandlers/loan/LoanCreatedEventHandler';
import { UserCreatedEventHandler } from '@eventHandlers/user/UserCreatedEventHandler';
import { UserPasswordChangedEventHandler } from '@eventHandlers/user/UserPasswordChangedEventHandler';
import { UserUpdatedEventHandler } from '@eventHandlers/user/UserUpdatedEventHandler';
import { CommandBus } from '@infrastructure/commandBus';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { RedisEventBus } from '@infrastructure/eventbus/redis';
import { BookEventStore } from '@infrastructure/eventstore/BookEventStore';
import { CartEventStore } from '@infrastructure/eventstore/CartEventStore';
import { LoanEventStore } from '@infrastructure/eventstore/LoanEventStore';
import { UserEventStore } from '@infrastructure/eventstore/UserEventStore';
import { getRedisClient } from '@infrastructure/redis';
import { BookRepository } from '@infrastructure/repositories/BookRepository';
import { CartRepository } from '@infrastructure/repositories/CartRepository';
import { LoanRepository } from '@infrastructure/repositories/LoanRepository';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { errorHandler } from '@interfaces/http/middlewares/ErrorHandler';

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
