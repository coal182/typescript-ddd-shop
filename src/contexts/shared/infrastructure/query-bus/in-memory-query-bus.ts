import { Query } from '../../domain/query';
import { QueryBus } from '../../domain/query-bus';
import { Response } from '../../domain/response';

import { QueryHandlers } from './query-handlers';

export class InMemoryQueryBus implements QueryBus {
  constructor(private queryHandlersInformation: QueryHandlers) {}

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this.queryHandlersInformation.get(query);

    return (await handler.handle(query)) as Promise<R>;
  }
}
