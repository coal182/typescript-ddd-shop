import MongoConfig from '@shared/infrastructure/persistence/mongo/mongo-config';

import shopConfig from '../../config';

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return {
      url: shopConfig.get('mongo.url'),
    };
  }
}
