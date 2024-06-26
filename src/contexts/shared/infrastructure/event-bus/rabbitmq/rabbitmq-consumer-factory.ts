import WinstonLogger from '@infrastructure/winston-logger';

import {RabbitMqConnection} from './rabbitmq-connection';
import {RabbitMQConsumer} from './rabbitmq-consumer';

import {DomainEvent} from '../../../domain/domain-event';
import {DomainEventSubscriber} from '../../../domain/domain-event-subscriber';
import {DomainEventDeserializer} from '../domain-event-deserializer';

export class RabbitMQConsumerFactory {
    constructor(
        private deserializer: DomainEventDeserializer,
        private connection: RabbitMqConnection,
        private maxRetries: number,
        private logger: WinstonLogger,
    ) {}

    build(subscriber: DomainEventSubscriber<DomainEvent>, exchange: string, queueName: string): RabbitMQConsumer {
        return new RabbitMQConsumer(
            {
                subscriber,
                deserializer: this.deserializer,
                connection: this.connection,
                queueName,
                exchange,
                maxRetries: this.maxRetries,
            },
            this.logger,
        );
    }
}
