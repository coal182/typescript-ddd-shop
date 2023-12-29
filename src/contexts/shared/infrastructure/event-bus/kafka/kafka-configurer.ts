import { DomainEvent } from '../../../domain/domain-event';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';

import { KafkaConnection } from './kafka-connection';
import { KafkaTopicFormatter } from './kafka-topic-formatter';

export class KafkaConfigurer {
  constructor(private connection: KafkaConnection, private topicNameFormatter: KafkaTopicFormatter) {}

  async configure(params: { subscribers: Array<DomainEventSubscriber<DomainEvent>> }): Promise<void> {
    for (const subscriber of params.subscribers) {
      await this.addTopic(subscriber);
    }
  }

  private async addTopic(subscriber: DomainEventSubscriber<DomainEvent>) {
    const topic = this.topicNameFormatter.formatFromSubscriber(subscriber);

    await this.connection.createTopic(topic);
  }
}
