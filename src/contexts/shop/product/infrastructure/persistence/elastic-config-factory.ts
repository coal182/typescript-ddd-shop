import ElasticConfig from '../../../../shared/infrastructure/persistence/elasticsearch/elastic-config';
import backofficeConfig from '../../../shared/infrastructure/config';

export class ElasticConfigFactory {
  static createConfig(): ElasticConfig {
    return {
      url: backofficeConfig.get('elastic.url'),
      indexName: backofficeConfig.get('elastic.indexName'),
      indexConfig: backofficeConfig.get('elastic.config'),
    };
  }
}
