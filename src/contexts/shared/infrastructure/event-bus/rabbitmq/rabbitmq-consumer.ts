import WinstonLogger from '@infrastructure/winston-logger';
import {ConsumeMessage} from 'amqplib';

import {RabbitMqConnection} from './rabbitmq-connection';

import {DomainEvent} from '../../../domain/domain-event';
import {DomainEventSubscriber} from '../../../domain/domain-event-subscriber';
import {DomainEventDeserializer} from '../domain-event-deserializer';

export class RabbitMQConsumer {
    private subscriber: DomainEventSubscriber<DomainEvent>;
    private deserializer: DomainEventDeserializer;
    private connection: RabbitMqConnection;
    private maxRetries: number;
    private queueName: string;
    private exchange: string;

    constructor(
        params: {
            subscriber: DomainEventSubscriber<DomainEvent>;
            deserializer: DomainEventDeserializer;
            connection: RabbitMqConnection;
            queueName: string;
            exchange: string;
            maxRetries: number;
        },
        private logger: WinstonLogger,
    ) {
        this.subscriber = params.subscriber;
        this.deserializer = params.deserializer;
        this.connection = params.connection;
        this.maxRetries = params.maxRetries;
        this.queueName = params.queueName;
        this.exchange = params.exchange;
    }

    async onMessage(message: ConsumeMessage): Promise<void> {
        const content = message.content.toString();
        const domainEvent = this.deserializer.deserialize(content);

        try {
            await this.subscriber.on(domainEvent);
        } catch (error) {
            this.logger.error(error as Error);
            await this.handleError(message);
        } finally {
            this.connection.ack(message);
        }
    }

    private async handleError(message: ConsumeMessage): Promise<void> {
        if (this.hasBeenRedeliveredTooMuch(message)) {
            await this.deadLetter(message);
        } else {
            await this.retry(message);
        }
    }

    private async retry(message: ConsumeMessage): Promise<void> {
        await this.connection.retry(message, this.queueName, this.exchange);
    }

    private async deadLetter(message: ConsumeMessage): Promise<void> {
        await this.connection.deadLetter(message, this.queueName, this.exchange);
    }

    private hasBeenRedeliveredTooMuch(message: ConsumeMessage): boolean {
        if (this.hasBeenRedelivered(message)) {
            const count = parseInt(message.properties.headers?.['redelivery_count']);
            return count >= this.maxRetries;
        }
        return false;
    }

    private hasBeenRedelivered(message: ConsumeMessage): boolean {
        return message.properties.headers?.['redelivery_count'] !== undefined;
    }
}
