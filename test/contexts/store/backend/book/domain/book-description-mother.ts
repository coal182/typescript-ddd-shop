import { BookDescription } from '@storeback/book/domain/book-description';
import { WordMother } from 'test/contexts/shared/word-mother';

export class BookDescriptionMother {
  static create(value: string): BookDescription {
    return new BookDescription(value);
  }

  static random(): BookDescription {
    return this.create(WordMother.random());
  }
}
