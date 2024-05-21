import {RabbitMqConnection} from './rabbitmq-connection';
import {RabbitMQExchangeNameFormatter} from './rabbitmq-exchange-name-formatter';
import {RabbitMQqueueFormatter} from './rabbitmq-queue-formatter';

import {DomainEvent} from '../../../domain/domain-event';
import {DomainEventSubscriber} from '../../../domain/domain-event-subscriber';

export class RabbitMQConfigurer {
    private retryTtl: number;

    constructor(
        private connection: RabbitMqConnection,
        private queueNameFormatter: RabbitMQqueueFormatter,
    ) {}

    async configure(params: {exchange: string; subscribers: Array<DomainEventSubscriber<DomainEvent>>; retryTtl: number}): Promise<void> {
        const retryExchange = RabbitMQExchangeNameFormatter.retry(params.exchange);
        const deadLetterExchange = RabbitMQExchangeNameFormatter.deadLetter(params.exchange);

        this.retryTtl = params.retryTtl;

        await this.connection.exchange({name: params.exchange});

        await this.connection.exchange({name: retryExchange});

        await this.connection.exchange({name: deadLetterExchange});

        for (const subscriber of params.subscribers) {
            await this.addQueue(subscriber, params.exchange);
        }
    }

    private async addQueue(subscriber: DomainEventSubscriber<DomainEvent>, exchange: string): Promise<void> {
        const retryExchange = RabbitMQExchangeNameFormatter.retry(exchange);
        const deadLetterExchange = RabbitMQExchangeNameFormatter.deadLetter(exchange);

        const routingKeys = this.getRoutingKeysFor(subscriber);

        const queue = this.queueNameFormatter.format(subscriber);
        const deadLetterQueue = this.queueNameFormatter.formatDeadLetter(subscriber);
        const retryQueue = this.queueNameFormatter.formatRetry(subscriber);

        await this.connection.queue({routingKeys, name: queue, exchange});
        await this.connection.queue({
            routingKeys: [queue],
            name: retryQueue,
            exchange: retryExchange,
            messageTtl: this.retryTtl,
            deadLetterExchange: exchange,
            deadLetterQueue: queue,
        });
        await this.connection.queue({routingKeys: [queue], name: deadLetterQueue, exchange: deadLetterExchange});
    }

    private getRoutingKeysFor(subscriber: DomainEventSubscriber<DomainEvent>): Array<string> {
        const routingKeys = subscriber.subscribedTo().map((event) => event.EVENT_NAME);

        const queue = this.queueNameFormatter.format(subscriber);
        routingKeys.push(queue);

        return routingKeys;
    }
}
