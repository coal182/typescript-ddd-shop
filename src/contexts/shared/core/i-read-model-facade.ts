import { Criteria } from '../criteria/Criteria';

export interface IReadModelFacade<T> {
  getAll(): Promise<T[]>;
  getById(guid: string): Promise<T>;
  getByField(field: string, value: any): Promise<T>;
  getByName(name: string): Promise<T>;
  matching(criteria: Criteria): Promise<ReadonlyArray<T>>;
}
