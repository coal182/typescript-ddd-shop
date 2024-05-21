import {MongoClientFactory} from '@infrastructure/persistence/mongo/mongo-client-factory';
import {MongoClient} from 'mongodb';

export class RabbitMQMongoClientMother {
    static async create(): Promise<MongoClient> {
        return MongoClientFactory.createClient('shared', {
            url: 'mongodb://localhost:27017/shop-backend-test1',
            username: 'mongouser',
            password: 'super-secret-password',
        });
    }
}
