import MongoConfig from '@shared/infrastructure/persistence/mongo/MongoConfig';

import config from '../../config';

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return {
      url: config.get('mongo.url'),
    };
  }
}
