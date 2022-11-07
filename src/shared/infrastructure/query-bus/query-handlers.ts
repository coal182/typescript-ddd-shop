import { IQuery } from '../../core/i-query';
import { IQueryHandler } from '../../core/i-query-handler';
import { IResponse } from '../../core/i-response';
import { QueryNotRegisteredError } from '../../core/query-not-registered-error';

export class QueryHandlers extends Map<IQuery, IQueryHandler<IQuery, IResponse>> {
  constructor(queryHandlers: Array<IQueryHandler<IQuery, Response>>) {
    super();
    queryHandlers.forEach((queryHandler) => {
      this.set(queryHandler.subscribedTo(), queryHandler);
    });
  }

  public get(query: IQuery): IQueryHandler<IQuery, IResponse> {
    const queryHandler = super.get(query.constructor);

    if (!queryHandler) {
      throw new QueryNotRegisteredError(query);
    }

    return queryHandler;
  }
}
