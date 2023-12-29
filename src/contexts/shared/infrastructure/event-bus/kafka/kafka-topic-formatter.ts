import { DomainEvent } from '../../../domain/domain-event';
import { DomainEventSubscriber } from '../../../domain/domain-event-subscriber';

export class KafkaTopicFormatter {
  constructor(private moduleName: string) {}

  formatFromSubscriber(subscriber: DomainEventSubscriber<DomainEvent>) {
    const value = subscriber.subscribedTo()[0].EVENT_NAME;
    const name = value
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
    return `${name}`;
  }

  formatFromEvent(eventName: DomainEvent) {
    const value = eventName.eventName;
    const name = value
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
    return `${name}`;
  }

  formatRetry(subscriber: DomainEventSubscriber<DomainEvent>) {
    const name = this.formatFromSubscriber(subscriber);
    return `retry.${name}`;
  }

  formatDeadLetter(subscriber: DomainEventSubscriber<DomainEvent>) {
    const name = this.formatFromSubscriber(subscriber);
    return `dead_letter.${name}`;
  }
}
