import { Collection, MongoClient } from 'mongodb';

import { DomainEventDeserializer } from '@infrastructure/EventBus/DomainEventDeserializer';
import { DomainEvent } from '@shared/domain/DomainEvent';
import { Uuid } from '@shared/value-objects/uuid';

export abstract class MongoEventRepository {
  constructor(private _client: Promise<MongoClient>, private deserializer?: DomainEventDeserializer) {}

  setDeserializer(deserializer: DomainEventDeserializer) {
    this.deserializer = deserializer;
  }

  protected abstract collectionName(): string;

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return (await this._client).db().collection(this.collectionName());
  }

  protected async persist(events: Array<DomainEvent>): Promise<void> {
    const collection = await this.collection();

    for (const event of events) {
      //const eventSerialized = DomainEventJsonSerializer.serialize(event);
      const eventSerialized = {
        ...event.toPrimitives(),
      };
      const options = { upsert: true };
      const update = {
        $set: {
          _id: event.eventId,
          eventId: event.eventId,
          aggregateId: event.aggregateId,
          eventName: event.eventName,
          data: eventSerialized,
          occurredOn: event.occurredOn,
        },
      };

      await collection.updateOne({ eventId: event.eventId }, update, options);
    }
  }

  async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
    const collection = await this.collection();

    const documents = await collection.find({ aggregateId }).sort({ occurredOn: 1 }).toArray();
    if (!this.deserializer) {
      throw new Error('Deserializer has not been set yet');
    }

    const events = documents.map((document) => this.deserializer!.deserialize(document.event));

    return events.filter(Boolean) as Array<DomainEvent>;
  }
}
