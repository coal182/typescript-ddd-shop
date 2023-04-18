import { Criteria } from '@shared/domain/criteria/Criteria';

import { Book } from './book';

export interface BookRepository {
  save(book: Book): Promise<void>;
  searchAll(): Promise<Array<Book>>;
  matching(criteria: Criteria): Promise<Array<Book>>;
}
