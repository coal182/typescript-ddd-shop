import { IQuery } from './i-query';

export class QueryNotRegisteredError extends Error {
  constructor(query: IQuery) {
    super(`The query <${query.constructor.name}> hasn't a query handler associated`);
  }
}
