import { ConnectionSettings } from '@infrastructure/event-bus/rabbitmq/connection-settings';
import { ExchangeSetting } from '@infrastructure/event-bus/rabbitmq/exchange-setting';

import shopConfig from '../config';

export type RabbitMQConfig = {
  connectionSettings: ConnectionSettings;
  exchangeSettings: ExchangeSetting;
  maxRetries: number;
  retryTtl: number;
};
export class RabbitMQConfigFactory {
  static createConfig(): RabbitMQConfig {
    return shopConfig.get('rabbitmq');
  }
}
