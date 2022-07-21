import { injectable, unmanaged } from 'inversify';

import { AggregateRoot } from '@core/aggregate-root';
import { IEventStore } from '@core/i-event-store';
import { IRepository } from '@core/i-repository';
@injectable()
export class Repository<T extends AggregateRoot> implements IRepository<T> {
  constructor(
    @unmanaged() private readonly eventStore: IEventStore,
    @unmanaged() private readonly Type: { new (): T }
  ) {}

  async save(aggregateRoot: T, expectedVersion: number) {
    await this.eventStore.saveEvents(aggregateRoot.guid.value, aggregateRoot.getUncommittedEvents(), expectedVersion);
    aggregateRoot.markChangesAsCommitted();
  }

  async getById(guid: string) {
    const aggregateRoot = new this.Type() as T;
    const history = await this.eventStore.getEventsForAggregate(guid);
    aggregateRoot.loadFromHistory(history);
    return aggregateRoot;
  }
}
