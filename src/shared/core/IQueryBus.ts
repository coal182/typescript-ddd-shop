import { IQuery } from './IQuery';
import { IResponse } from './IResponse';

export interface IQueryBus {
  ask<R extends IResponse>(query: IQuery): Promise<R>;
}
