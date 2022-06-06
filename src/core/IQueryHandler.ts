export interface IQueryHandler<TQuery> {
  handle(query: TQuery): any;
}
