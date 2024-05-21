import {DomainEvent, DomainEventClass} from '@shared/domain/domain-event';
import {Uuid} from '@shared/domain/value-objects/uuid';
import {Collection, MongoClient} from 'mongodb';

export abstract class MongoEventStore {
    constructor(private _client: Promise<MongoClient>) {}

    protected abstract collectionName(): string;
    protected abstract eventsMap(): Map<string, DomainEventClass>;

    protected client(): Promise<MongoClient> {
        return this._client;
    }

    protected async collection(): Promise<Collection> {
        return (await this._client).db().collection(this.collectionName());
    }

    protected async persist(events: Array<DomainEvent>): Promise<void> {
        const collection = await this.collection();

        for (const event of events) {
            const eventPrimitives = {
                ...event.toPrimitives(),
            };
            const options = {upsert: true};
            const update = {
                $set: {
                    _id: event.eventId,
                    eventId: event.eventId,
                    aggregateId: event.aggregateId,
                    eventName: event.eventName,
                    data: eventPrimitives,
                    occurredOn: event.occurredOn,
                },
            };

            await collection.updateOne({eventId: event.eventId}, update, options);
        }
    }

    protected async findByAggregateId(aggregateId: Uuid): Promise<DomainEvent[]> {
        const collection = await this.collection();
        const documents = await collection.find({aggregateId: aggregateId.value}).sort({occurredOn: 1}).toArray();

        const events = documents.map<DomainEvent>((document) => {
            const {aggregateId, eventId, eventName, data, occurredOn} = document;

            const eventClass = this.eventsMap().get(eventName);
            if (!eventClass) {
                throw Error(`DomainEvent mapping not found for event ${eventName}`);
            }

            return eventClass.fromPrimitives({
                aggregateId,
                eventId,
                occurredOn,
                data,
            });
        });

        return events;
    }
}
