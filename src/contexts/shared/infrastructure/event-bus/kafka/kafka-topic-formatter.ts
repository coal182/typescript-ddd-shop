import { DomainEvent } from '../../../domain/domain-event';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';

export class KafkaTopicFormatter {
  constructor(private moduleName: string) {}

  format(subscriber: DomainEventSubscriber<DomainEvent> | DomainEvent) {
    const value = subscriber.constructor.name;
    const name = value
      .replace('EventHandler', '')
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
    return `${name}`;
  }

  formatRetry(subscriber: DomainEventSubscriber<DomainEvent>) {
    const name = this.format(subscriber);
    return `retry.${name}`;
  }

  formatDeadLetter(subscriber: DomainEventSubscriber<DomainEvent>) {
    const name = this.format(subscriber);
    return `dead_letter.${name}`;
  }
}
