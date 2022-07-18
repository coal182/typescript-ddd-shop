import { BookAuthor } from '@storeback/book/domain/book-author';
import { UuidMother } from 'test/contexts/shared/uuid-mother';

export class BookAuthorMother {
  static create(value: string): BookAuthor {
    return new BookAuthor(value);
  }

  static creator() {
    return () => BookAuthorMother.random();
  }

  static random(): BookAuthor {
    return this.create(UuidMother.random());
  }
}
