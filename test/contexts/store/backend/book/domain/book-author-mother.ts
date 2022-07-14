import { BookAuthor } from '@storeback/book/domain/book-author';
import { WordMother } from 'test/contexts/shared/word-mother';

export class BookAuthorMother {
  static create(value: string): BookAuthor {
    return new BookAuthor(value);
  }

  static random(): BookAuthor {
    return this.create(WordMother.random());
  }
}
