import { IEvent } from './IEvent';

export abstract class AggregateRoot {
  [x: string]: any;
  private __version = -1;
  private __changes: any[] = [];

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
    console.log('event: ', event);
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
