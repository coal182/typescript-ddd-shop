import { BookId } from '@storeback/book/domain/book-id';
import { UuidMother } from 'test/contexts/shared/uuid-mother';

export class BookIdMother {
  static create(value: string): BookId {
    return new BookId(value);
  }

  static creator() {
    return () => BookIdMother.random();
  }

  static random(): BookId {
    return this.create(UuidMother.random());
  }
}
