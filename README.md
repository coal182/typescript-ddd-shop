# TypeScript DDD, CQRS, Event Sourcing and Angular Shop

### Architecture

This project uses DDD with Hexagonal Architecture, CQRS & Event Sourcing

The workflow is that the write side sends the `commands` to the `command handlers` through `commandBus` to alter the information. The succeeded commands will then generate resulting `events` which are then stored in the `event store`. Finally, the `event handlers` subscribe to events and generate the projection / read store.

The only source of truth of Event Sourcing systems is the `event store` while the data in the read store is simply a derivative of the events generated from the write side. This means we can use totally different data structure between the read and the write sides and we can replay the events from the event store from the whenever we want the regenerate the denormalised data in whatever shapes we want.

In this example, we use `MongoDB` for both event store and read store, for example, having the collection `product_events` to store the events and th`collection`product` to project the last state of the aggregates as the read store model.

The commands are sent by the frontend to the `commandBus` which then selects appropriate `command handlers` for the commands. The command handlers then prepare the `Aggregate Root` and apply the business logic suitable for them. If the commands succeed, they result in events which will then be sent to the `eventBus` to the `event handlers`. In this example, the eventBus is implemented using `RabbitMq`.

### Technologies

1. Node.js
2. TypeScript
3. MongoDB with MongoDB native driver as event store and projections
4. node-dependency-injection as an IoC container
5. Express (via Inversify Express Utils) as an API framework
6. RabbitMq as the message bus
7. Angular as UI

## Components

This project follows the standard CQRS & Event Sourcing applications available on GitHub. Highly inspired by Greg Young's SimpleCQRS project (written in ASP.NET C#).

Below is the list of components in this project

1. **Domain Model** (Aggregate Root)<br/>
   Contains the business logic required for the application
2. **Commands**<br/>
   The command class reflects the intention of the users to alter the state of the application
3. **CommandHandlers**<br/>
   The command processor managed by `CommandBus`. It prepares the Aggregate Root and applies business logic on it.
4. **CommandBus**<br/>
   The command management object which receieves incoming commands and select appropriate handlers for them.
5. **Events**<br/>
   The resulting objects from describing the changes generated by succeeding commands which are sent through the `EventBus`.
6. **Event Store**
   The storage that stores events. This is the only source of truth of the system (The sequence of events generated by the application).
7. **EventBus**<br/>
   The bus that contains the events where event handlers subscribe to. In this example, `RabbitMq` is used to implement this bus.
8. **Event Handlers**<br/>
   The event processor. This could be the projector or the denormaliser that generates the data for the read side on the read storage.

## Getting Started

```bash
cp .env_template .env
```

To deploy docker container

```bash
docker-compose up
```

### To test

Backend:

```bash
npm run test
```

UI:

```bash
cd ui/
npm run test
```
