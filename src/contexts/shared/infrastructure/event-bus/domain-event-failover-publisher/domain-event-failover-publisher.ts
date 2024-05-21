import {Collection, MongoClient} from 'mongodb';

import {DomainEvent} from '../../../domain/domain-event';
import {DomainEventDeserializer} from '../domain-event-deserializer';
import {DomainEventJsonSerializer} from '../domain-event-json-serializer';

export class DomainEventFailoverPublisher {
    static collectionName = 'domain_events';

    constructor(
        private client: Promise<MongoClient>,
        private deserializer?: DomainEventDeserializer,
    ) {}

    protected async collection(): Promise<Collection> {
        return (await this.client).db().collection(DomainEventFailoverPublisher.collectionName);
    }

    setDeserializer(deserializer: DomainEventDeserializer): void {
        this.deserializer = deserializer;
    }

    async publish(event: DomainEvent): Promise<void> {
        const collection = await this.collection();

        const eventSerialized = DomainEventJsonSerializer.serialize(event);
        const options = {upsert: true};
        const update = {$set: {eventId: event.eventId, event: eventSerialized}};

        await collection.updateOne({eventId: event.eventId}, update, options);
    }

    async consume(): Promise<Array<DomainEvent>> {
        const collection = await this.collection();
        const documents = await collection.find().limit(200).toArray();
        if (!this.deserializer) {
            throw new Error('Deserializer has not been set yet');
        }

        const events = documents.map((document) => this.deserializer!.deserialize(document.event));

        return events.filter(Boolean) as Array<DomainEvent>;
    }
}
