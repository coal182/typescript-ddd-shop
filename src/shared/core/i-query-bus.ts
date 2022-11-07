import { IQuery } from './i-query';
import { IQueryHandler } from './i-query-handler';
import { IResponse } from './i-response';

export interface IQueryBus {
  subscribeHandler<Q, R>(query: new () => IQuery, handler: IQueryHandler<Q, R>): void;
  ask<R extends IResponse>(query: IQuery): Promise<R>;
}
