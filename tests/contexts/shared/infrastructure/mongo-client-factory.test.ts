import {MongoClientFactory} from '@infrastructure/persistence/mongo/mongo-client-factory';
import {expect} from 'chai';
import {MongoClient} from 'mongodb';

describe('MongoClientFactory', () => {
    const factory = MongoClientFactory;
    let client: MongoClient;

    beforeEach(async () => {
        client = await factory.createClient('test', {
            url: 'mongodb://localhost:27017/mooc-backend-test1',
            username: 'mongouser',
            password: 'super-secret-password',
        });
    });

    afterEach(async () => {
        await client.close();
    });

    it('creates a new client with the connection already established', () => {
        expect(client).to.be.instanceOf(MongoClient);
    });

    it('creates a new client if it does not exist a client with the given name', async () => {
        const newClient = await factory.createClient('test2', {
            url: 'mongodb://localhost:27017/mooc-backend-test2',
            username: 'mongouser',
            password: 'super-secret-password',
        });

        expect(newClient).not.to.be.equal(client);

        await newClient.close();
    });

    it('returns a client if it already exists', async () => {
        const newClient = await factory.createClient('test', {
            url: 'mongodb://localhost:27017/mooc-backend-test3',
            username: 'mongouser',
            password: 'super-secret-password',
        });

        expect(newClient).to.be.equal(client);

        await newClient.close();
    });
});
