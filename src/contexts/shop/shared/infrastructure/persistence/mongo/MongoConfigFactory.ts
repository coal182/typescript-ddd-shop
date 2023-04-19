import MongoConfig from '@shared/infrastructure/persistence/mongo/mongo-config';

import config from '../../config';

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return {
      url: config.get('mongo.url'),
    };
  }
}
