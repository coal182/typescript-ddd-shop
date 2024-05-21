import WinstonLogger from '@infrastructure/winston-logger';
import {EachMessagePayload} from 'kafkajs';

import {DomainEvent} from '../../../domain/domain-event';
import {DomainEventSubscriber} from '../../../domain/domain-event-subscriber';
import {DomainEventDeserializer} from '../domain-event-deserializer';

export class KafkaConsumer {
    private subscriber: DomainEventSubscriber<DomainEvent>;
    private deserializer: DomainEventDeserializer;

    constructor(
        params: {
            subscriber: DomainEventSubscriber<DomainEvent>;
            deserializer: DomainEventDeserializer;
            topicName: string;
        },
        private logger: WinstonLogger,
    ) {
        this.subscriber = params.subscriber;
        this.deserializer = params.deserializer;
    }

    async onMessage(message: EachMessagePayload): Promise<void> {
        const content = message.message.value?.toString() ?? '';
        const domainEvent = this.deserializer.deserialize(content);

        try {
            await this.subscriber.on(domainEvent);
        } catch (error) {
            this.logger.error(error as Error);
            this.handleError(message);
        }
    }

    private handleError(message: EachMessagePayload): void {
        this.logger.error(`Error handling kafka message ${JSON.stringify(message)}`);
    }
}
