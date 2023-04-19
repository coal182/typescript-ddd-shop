import { DomainEvent } from './domain-event';

type Prefix<K> = K extends string ? `apply${K}` : K;
export abstract class AggregateRoot {
  [x: Prefix<string>]: (event: any) => void;
  private domainEvents: Array<DomainEvent>;

  constructor() {
    this.domainEvents = [];
  }

  pullDomainEvents(): Array<DomainEvent> {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];

    return domainEvents;
  }

  record(event: DomainEvent): void {
    this.domainEvents.push(event);
    //this.applyEvent(event, true);
  }

  loadFromHistory(events: DomainEvent[]) {
    for (const event of events) {
      this.applyEvent(event);
    }
  }

  abstract applyEvent(event: DomainEvent): void;

  abstract toPrimitives(): any;
}
