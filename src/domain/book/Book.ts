/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AggregateRoot } from '@core/AggregateRoot';
import { Primitives } from 'shared/primitives-type';

import { BookAuthor } from './BookAuthor';
import { BookDescription } from './BookDescription';
import { BookId } from './BookId';
import { BookImage } from './BookImage';
import { BookName } from './BookName';
import { BookPrice } from './BookPrice';
import { BookAuthorChanged } from './events/BookAuthorChanged';
import { BookCreated } from './events/BookCreated';
import { BookDescriptionChanged } from './events/BookDescriptionChanged';
import { BookImageChanged } from './events/BookImageChanged';
export class Book extends AggregateRoot {
  public id: BookId;
  public name: BookName;
  public description: BookDescription;
  public image: BookImage;
  public authorId: BookAuthor;
  public price: BookPrice;

  constructor();

  constructor(
    id: BookId,
    name: BookName,
    description: BookDescription,
    image: BookImage,
    authorId: BookAuthor,
    price: BookPrice
  );

  constructor(
    id?: BookId,
    name?: BookName,
    description?: BookDescription,
    image?: BookImage,
    authorId?: BookAuthor,
    price?: BookPrice
  ) {
    super();
    // This if block is required as we instantiate the aggregate root in the repository
    if (id && name && description && image && authorId && price) {
      this.applyChange(
        new BookCreated(id.value!, name.value!, description.value!, image.value!, authorId.value!, price.value!)
      );
    }
  }

  public changeAuthor(authorId: BookAuthor) {
    this.authorId = authorId;
    this.applyChange(new BookAuthorChanged(this.id.value, authorId.value));
  }

  public changeDescription(description: BookDescription) {
    this.description = description;
    this.applyChange(new BookDescriptionChanged(this.id.value, description.value));
  }

  public changeImage(image: BookImage) {
    this.image = image;
    this.applyChange(new BookImageChanged(this.id.value, image.value));
  }

  public applyBookCreated(event: BookCreated): void {
    this.id = new BookId(event.id);
    this.name = new BookName(event.name);
    this.description = new BookDescription(event.description);
    this.image = new BookImage(event.image);
    this.authorId = new BookAuthor(event.authorId);
    this.price = new BookPrice(event.price);
  }

  public applyBookAuthorChanged(event: BookAuthorChanged): void {
    this.authorId = new BookAuthor(event.authorId);
  }

  public applyBookDescriptionChanged(event: BookDescriptionChanged): void {
    this.description = new BookDescription(event.description);
  }

  public applyBookImageChanged(event: BookImageChanged): void {
    this.image = new BookImage(event.image);
  }

  static fromPrimitives(plainData: {
    id: string;
    name: string;
    description: string;
    image: string;
    authorId: string;
    price: number;
  }): Book {
    return new Book(
      new BookId(plainData.id),
      new BookName(plainData.name),
      new BookDescription(plainData.description),
      new BookImage(plainData.image),
      new BookAuthor(plainData.authorId),
      new BookPrice(plainData.price)
    );
  }

  toPrimitives(): Primitives<Book> {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
      image: this.image.value,
      authorId: this.authorId.value,
      price: String(this.price.value),
    };
  }
}
