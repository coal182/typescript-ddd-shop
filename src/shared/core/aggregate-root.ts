import { Uuid } from '@shared/value-objects/uuid';

import { IEvent } from './i-event';

type Prefix<K> = K extends string ? `apply${K}` : K;
export abstract class AggregateRoot {
  [x: Prefix<string>]: (event: any) => void;
  public guid: Uuid;
  private __version = -1;
  private __changes: IEvent[] = [];

  get version() {
    return this.__version;
  }

  constructor() {
    this.__changes = [];
  }

  public getUncommittedEvents(): IEvent[] {
    return this.__changes;
  }

  public markChangesAsCommitted(): void {
    this.__changes = [];
  }

  protected applyChange(event: IEvent) {
    this.applyEvent(event, true);
  }

  private applyEvent(event: IEvent, isNew = false) {
    this[`apply${event.eventName}`](event);
    if (isNew) this.__changes.push(event);
  }

  public loadFromHistory(events: IEvent[]) {
    for (const event of events) {
      this.applyEvent(event);
      this.__version++;
    }
  }
}
