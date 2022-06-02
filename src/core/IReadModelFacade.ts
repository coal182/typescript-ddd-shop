export interface IReadModelFacade<T> {
  getAll(): Promise<T[]>;
  getById(guid: string): Promise<T>;
  getByField(field: string, value: any): Promise<T>;
}
