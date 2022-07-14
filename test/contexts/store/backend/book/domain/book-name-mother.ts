import { BookName } from '@storeback/book/domain/book-name';
import { WordMother } from 'test/contexts/shared/word-mother';

export class BookNameMother {
  static create(value: string): BookName {
    return new BookName(value);
  }

  static random(): BookName {
    return this.create(WordMother.random());
  }
}
