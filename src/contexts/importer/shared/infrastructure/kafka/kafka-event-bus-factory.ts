import { DomainEventFailoverPublisher } from '@infrastructure/event-bus/domain-event-failover-publisher/domain-event-failover-publisher';
import { KafkaConnection } from '@infrastructure/event-bus/kafka/kafka-connection';
import { KafkaEventBus } from '@infrastructure/event-bus/kafka/kafka-event-bus';
import { KafkaTopicFormatter } from '@infrastructure/event-bus/kafka/kafka-topic-formatter';
import WinstonLogger from '@infrastructure/winston-logger';

export class KafkaEventBusFactory {
  static create(
    failoverPublisher: DomainEventFailoverPublisher,
    connection: KafkaConnection,
    topicNameFormatter: KafkaTopicFormatter,
    logger: WinstonLogger
  ): KafkaEventBus {
    return new KafkaEventBus(
      {
        failoverPublisher,
        connection,
        topicNameFormatter: topicNameFormatter,
      },
      logger
    );
  }
}
