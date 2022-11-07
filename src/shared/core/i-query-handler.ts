import { IQuery } from './i-query';
import { IResponse } from './i-response';

export interface IQueryHandler<Q extends IQuery, R extends IResponse> {
  subscribedTo(): IQuery;
  handle(query: Q): Promise<R>;
}
