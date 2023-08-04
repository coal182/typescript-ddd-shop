import { expect } from 'chai';

import { InMemoryQueryBus } from '@infrastructure/query-bus/in-memory-query-bus';
import { QueryHandlers } from '@infrastructure/query-bus/query-handlers';
import { Query } from '@shared/domain/query';
import { QueryHandler } from '@shared/domain/query-handler';
import { QueryNotRegisteredError } from '@shared/domain/query-not-registered-error';
import { Response } from '@shared/domain/response';

class UnhandledQuery extends Query {
  static QUERY_NAME = 'unhandled.query';
}

class HandledQuery extends Query {
  static QUERY_NAME = 'handled.query';
}

class MyQueryHandler implements QueryHandler<Query, Response> {
  subscribedTo(): HandledQuery {
    return HandledQuery;
  }

  async handle(query: HandledQuery): Promise<Response> {
    return {};
  }
}

describe('InMemoryQueryBus', () => {
  it('throws an error if dispatches a query without handler', async () => {
    const unhandledQuery = new UnhandledQuery();
    const queryHandlers = new QueryHandlers([]);
    const queryBus = new InMemoryQueryBus(queryHandlers);

    expect(queryBus.ask(unhandledQuery)).to.be.rejectedWith(QueryNotRegisteredError);
  });

  it('accepts a query with handler', async () => {
    const handledQuery = new HandledQuery();
    const myQueryHandler = new MyQueryHandler();
    const queryHandlers = new QueryHandlers([myQueryHandler]);
    const queryBus = new InMemoryQueryBus(queryHandlers);

    await queryBus.ask(handledQuery);
  });
});
