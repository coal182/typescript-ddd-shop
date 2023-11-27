import WinstonLogger from '@infrastructure/winston-logger';

import { DomainEvent } from '../../../domain/domain-event';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';
import { DomainEventDeserializer } from '../domain-event-deserializer';

import { KafkaConsumer } from './kafka-consumer';

export class KafkaConsumerFactory {
  constructor(private deserializer: DomainEventDeserializer, private logger: WinstonLogger) {}

  build(subscriber: DomainEventSubscriber<DomainEvent>, topicName: string) {
    return new KafkaConsumer(
      {
        subscriber,
        deserializer: this.deserializer,
        topicName: topicName,
      },
      this.logger
    );
  }
}
