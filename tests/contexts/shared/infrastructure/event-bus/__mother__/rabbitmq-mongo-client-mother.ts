import { MongoClientFactory } from '@infrastructure/persistence/mongo/mongo-client-factory';

export class RabbitMQMongoClientMother {
  static async create() {
    return MongoClientFactory.createClient('shared', {
      url: 'mongodb://localhost:27017/mooc-backend-test1',
      username: 'mongouser',
      password: 'super-secret-password',
    });
  }
}
