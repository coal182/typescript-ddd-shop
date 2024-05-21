import {KafkaConfig} from '@infrastructure/event-bus/kafka/kafka-config';

import shopConfig from '../config';

export class KafkaConfigFactory {
    static createConfig(): KafkaConfig {
        return shopConfig.get('kafka');
    }
}
