import { IQuery } from './i-query';
import { IResponse } from './i-response';

export interface IQueryBus {
  ask<R extends IResponse>(query: IQuery): Promise<R>;
}
