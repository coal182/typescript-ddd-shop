import { DomainEvent } from './DomainEvent';

type Prefix<K> = K extends string ? `apply${K}` : K;
export abstract class AggregateRoot {
  [x: Prefix<string>]: (event: any) => void;
  private __version = -1;
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
      this.__version++;
    }
  }

  private applyEvent(event: DomainEvent, isNew = false) {
    this[`apply${event.eventName}`](event);
    if (isNew) this.domainEvents.push(event);
  }

  abstract toPrimitives(): any;
}
