import { Book } from '@storeback/book/domain/book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookId } from '@storeback/book/domain/book-id';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';

import { BookAuthorMother } from './book-author-mother';
import { BookDescriptionMother } from './book-description-mother';
import { BookIdMother } from './book-id-mother';
import { BookImageMother } from './book-image-mother';
import { BookNameMother } from './book-name-mother';
import { BookPriceMother } from './book-price-mother';

export class BookMother {
  static create(
    guid: BookId,
    name: BookName,
    description: BookDescription,
    image: BookImage,
    author: BookAuthor,
    price: BookPrice
  ): Book {
    return new Book({ guid, name, description, image, author, price });
  }

  static random(): Book {
    return this.create(
      BookIdMother.random(),
      BookNameMother.random(),
      BookDescriptionMother.random(),
      BookImageMother.random(),
      BookAuthorMother.random(),
      BookPriceMother.random()
    );
  }
}
