import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const expect = chai.expect;

import { AggregateRoot } from '@core/aggregate-root';
import { IEventStore } from '@core/i-event-store';
import { IRepository } from '@core/i-repository';

export class RepositoryMock<T extends AggregateRoot> implements IRepository<T> {
  private mockSave = sinon.spy();
  private mockGetById = sinon.spy();

  constructor(private readonly eventStore: IEventStore, private readonly Type: { new (): T }) {}

  async save(aggregateRoot: T, expectedVersion: number) {
    this.mockSave(aggregateRoot, expectedVersion);
    await this.eventStore.saveEvents(aggregateRoot.guid, aggregateRoot.getUncommittedEvents(), expectedVersion);
    aggregateRoot.markChangesAsCommitted();
  }

  assertSaveHasBeenCalledWith(aggregateRoot: T, expectedVersion: number) {
    expect(this.mockSave).to.have.been.calledWith(aggregateRoot, expectedVersion);
  }

  async getById(guid: string): Promise<T> {
    const aggregateRoot = new this.Type() as T;
    const history = await this.eventStore.getEventsForAggregate(guid);
    aggregateRoot.loadFromHistory(history);
    return aggregateRoot;
  }
}
