import {DomainEvent} from './domain-event';
import {Uuid} from './value-objects/uuid';

type Prefix<K> = K extends string ? `apply${K}` : K;
export abstract class AggregateRoot {
    [x: Prefix<string>]: (event: any) => void;
    private domainEvents: Array<DomainEvent>;
    protected id: Uuid;

    constructor() {
        this.domainEvents = [];
    }

    getId(): string {
        return this.id.toString();
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

    loadFromHistory(events: DomainEvent[]): void {
        for (const event of events) {
            this.applyEvent(event);
        }
    }

    abstract applyEvent(event: DomainEvent): void;

    abstract toPrimitives(): any;
}
