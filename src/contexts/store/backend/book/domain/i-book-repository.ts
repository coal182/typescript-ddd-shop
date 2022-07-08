import { IRepository } from '@core/i-repository';

import { Book } from './book';

export interface IBookRepository extends IRepository<Book> {}
