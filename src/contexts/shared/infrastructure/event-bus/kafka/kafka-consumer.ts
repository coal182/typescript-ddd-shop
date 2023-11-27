import { EachMessagePayload } from 'kafkajs';

import WinstonLogger from '@infrastructure/winston-logger';

import { DomainEvent } from '../../../domain/domain-event';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';
import { DomainEventDeserializer } from '../domain-event-deserializer';

export class KafkaConsumer {
  private subscriber: DomainEventSubscriber<DomainEvent>;
  private deserializer: DomainEventDeserializer;

  constructor(
    params: {
      subscriber: DomainEventSubscriber<DomainEvent>;
      deserializer: DomainEventDeserializer;
      topicName: string;
    },
    private logger: WinstonLogger
  ) {
    this.subscriber = params.subscriber;
    this.deserializer = params.deserializer;
  }

  async onMessage(message: EachMessagePayload) {
    const content = message.message.value?.toString() ?? '';
    const domainEvent = this.deserializer.deserialize(content);

    try {
      await this.subscriber.on(domainEvent);
    } catch (error) {
      this.logger.error(error as Error);
      await this.handleError(message);
    }
  }

  private async handleError(message: EachMessagePayload) {
    this.logger.error(`Error handling kafka message ${JSON.stringify(message)}`);
  }
}
