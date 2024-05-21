import WinstonLogger from '@infrastructure/winston-logger';

import {KafkaConsumer} from './kafka-consumer';

import {DomainEvent} from '../../../domain/domain-event';
import {DomainEventSubscriber} from '../../../domain/domain-event-subscriber';
import {DomainEventDeserializer} from '../domain-event-deserializer';

export class KafkaConsumerFactory {
    constructor(
        private deserializer: DomainEventDeserializer,
        private logger: WinstonLogger,
    ) {}

    build(subscriber: DomainEventSubscriber<DomainEvent>, topicName: string): KafkaConsumer {
        return new KafkaConsumer(
            {
                subscriber,
                deserializer: this.deserializer,
                topicName: topicName,
            },
            this.logger,
        );
    }
}
