import { BookPrice } from '@storeback/book/domain/book-price';
import { IntegerMother } from 'test/contexts/shared/intenger-mother';

export class BookPriceMother {
  static create(value: number): BookPrice {
    return new BookPrice(value);
  }

  static random(): BookPrice {
    return this.create(IntegerMother.random());
  }
}
