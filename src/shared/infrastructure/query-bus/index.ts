import { injectable } from 'inversify';

import 'reflect-metadata';
import { IQuery } from '@core/i-query';
import { IQueryBus } from '@core/i-query-bus';
import { IQueryHandler } from '@core/i-query-handler';
import { IResponse } from '@core/i-response';
import { Query } from '@core/query';
import { QueryNotRegisteredError } from '@core/query-not-registered-error';

@injectable()
export class QueryBus implements IQueryBus {
  public handlers: Map<string, IQueryHandler<IQuery, IResponse>> = new Map();

  public subscribeHandler<Q extends IQuery, R extends IResponse>(query: new () => Query, handler: IQueryHandler<Q, R>) {
    if (this.handlers.has(query.name)) {
      return;
    }
    this.handlers.set(query.name, handler);
  }

  async ask<R extends IResponse>(query: IQuery): Promise<R> {
    if (this.handlers.has(query.constructor.name)) {
      return (await (this.handlers.get(query.constructor.name) as IQueryHandler<IQuery, R>).handle(
        query
      )) as Promise<R>;
    } else {
      throw new QueryNotRegisteredError(query);
    }
  }
}
