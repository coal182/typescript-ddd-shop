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
import {
  AuthorReadModelFacade,
  IAuthorReadModelFacade,
} from '@storeback/author/infrastructure/projection/authors/read-model';
import { BookCreator } from '@storeback/book/application/book-creator';
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

  // Use Cases
  container.bind<BookCreator>(TYPES.BookCreator).to(BookCreator);

  // Read models for query
  container.bind<IBookReadModelFacade>(TYPES.BookReadModelFacade).to(BookReadModelFacade);
  container.bind<IAuthorReadModelFacade>(TYPES.AuthorReadModelFacade).to(AuthorReadModelFacade);

  // Event Handlers
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(FakeNotificationEventHandler);
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(BookCreatedEventHandler);
  container.bind<IEventHandler<BookAuthorChanged>>(TYPES.Event).to(BookAuthorChangedEventHandler);
  container.bind<IEventHandler<BookDescriptionChanged>>(TYPES.Event).to(BookDescriptionChangedEventHandler);
  container.bind<IEventHandler<BookImageChanged>>(TYPES.Event).to(BookImageChangedEventHandler);
  // Prepare persistence components
  container.bind<Db>(TYPES.Db).toConstantValue(db);
  container.bind<IEventStore>(TYPES.EventStore).to(BookEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Book);
  container.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);

  // Register command handlers
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateBookCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookAuthorCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookDescriptionCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookImageCommandHandler);

  // Create command bus
  const commandBus = new CommandBus();

  // Register all the command handler here
  container.getAll<ICommandHandler<Command>[]>(TYPES.CommandHandler).forEach((handler: any) => {
    console.log(handler.constructor.commandToHandle);
    console.log(handler);
    commandBus.registerHandler(handler.constructor.commandToHandle, handler);
  });

  container.bind<CommandBus>(TYPES.CommandBus).toConstantValue(commandBus);

  return container;
};
