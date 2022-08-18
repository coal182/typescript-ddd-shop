export const TYPES = {
  // Dependencies
  Db: Symbol('Db'),
  RedisSubscriber: Symbol('RedisSubscriber'),
  Redis: Symbol('Redis'),
  EventBus: Symbol('EventBus'),

  // Repositories
  BookRepository: Symbol('BookRepository'),
  UserRepository: Symbol('UserRepository'),
  LoanRepository: Symbol('LoanRepository'),
  CartRepository: Symbol('CartRepository'),
  OrderRepository: Symbol('OrderRepository'),

  // Application Services
  BookApplication: Symbol('BookApplication'),

  // Use Cases
  BookCreator: Symbol('BookCreator'),

  // Read Model Facade (for book)
  BookReadModelFacade: Symbol('BookReadModelFacade'),
  AuthorReadModelFacade: Symbol('AuthorReadModelFacade'),
  UserReadModelFacade: Symbol('UserReadModelFacade'),
  CartReadModelFacade: Symbol('CartReadModelFacade'),
  OrderReadModelFacade: Symbol('OrderReadModelFacade'),

  // Command Bus
  CommandBus: Symbol('CommandBus'),

  // Command Handlers
  CommandHandler: Symbol('CommandHandler'),

  // Event
  Event: Symbol('Event'),
  EventHandler: Symbol('EventHandler'),
  EventStore: Symbol('EventStore'),

  // Event Handlers
  BookCreatedEventHandler: Symbol('BookCreatedEventHandler'),

  // Event Store
  BookEventStore: Symbol('BookEventStore'),
  UserEventStore: Symbol('UserEventStore'),
  LoanEventStore: Symbol('LoanEventStore'),
  CartEventStore: Symbol('CartEventStore'),
  OrderEventStore: Symbol('OrderEventStore'),
};

export const EVENT_STREAM_NAMES = {
  Book: Symbol('Book'),
  User: Symbol('User'),
  Loan: Symbol('Loan'),
  Cart: Symbol('Cart'),
  Order: Symbol('Order'),
};
