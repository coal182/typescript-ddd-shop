import { BookImage } from '@storeback/book/domain/book-image';
import { WordMother } from 'test/contexts/shared/word-mother';

export class BookImageMother {
  static create(value: string): BookImage {
    return new BookImage(value);
  }

  static random(): BookImage {
    return this.create(WordMother.random());
  }
}
