import { expect } from 'chai';
import { MongoClient } from 'mongodb';

import { MongoClientFactory } from '@infrastructure/persistence/mongo/mongo-client-factory';

describe('MongoClientFactory', () => {
  const factory = MongoClientFactory;
  let client: MongoClient;

  beforeEach(async () => {
    client = await factory.createClient('test', { url: 'mongodb://localhost:27017/mooc-backend-test1' });
  });

  afterEach(async () => {
    await client.close();
  });

  it('creates a new client with the connection already established', () => {
    expect(client).to.be.instanceOf(MongoClient);
  });

  it('creates a new client if it does not exist a client with the given name', async () => {
    const newClient = await factory.createClient('test2', { url: 'mongodb://localhost:27017/mooc-backend-test2' });

    expect(newClient).not.to.be.equal(client);

    await newClient.close();
  });

  it('returns a client if it already exists', async () => {
    const newClient = await factory.createClient('test', { url: 'mongodb://localhost:27017/mooc-backend-test3' });

    expect(newClient).to.be.equal(client);

    await newClient.close();
  });
});
