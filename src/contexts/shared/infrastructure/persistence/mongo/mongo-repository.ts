import {Collection, Document, MongoClient} from 'mongodb';

import {MongoCriteriaConverter} from '../../../../backoffice/product/infrastructure/persistence/mongo-criteria-converter';
import {AggregateRoot} from '../../../domain/aggregate-root';
import {Criteria} from '../../../domain/criteria/criteria';

export abstract class MongoRepository<T extends AggregateRoot> {
    private criteriaConverter: MongoCriteriaConverter;

    constructor(private _client: Promise<MongoClient>) {
        this.criteriaConverter = new MongoCriteriaConverter();
    }

    protected abstract collectionName(): string;

    protected client(): Promise<MongoClient> {
        return this._client;
    }

    protected async collection(): Promise<Collection> {
        return (await this._client).db().collection(this.collectionName());
    }

    protected async persist(id: string, aggregateRoot: T): Promise<void> {
        const collection = await this.collection();

        const document = {...aggregateRoot.toPrimitives(), _id: id, id};

        await collection.updateOne({_id: id}, {$set: document}, {upsert: true});
    }

    protected async searchByCriteria<D extends Document>(criteria: Criteria): Promise<D[]> {
        const query = this.criteriaConverter.convert(criteria);

        const collection = await this.collection();

        return await collection.find<D>(query.filter, {}).sort(query.sort).skip(query.skip).limit(query.limit).toArray();
    }
}
