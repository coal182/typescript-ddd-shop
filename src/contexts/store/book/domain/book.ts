/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AggregateRoot } from '@shared/domain/AggregateRoot';

import { BookAuthor } from './book-author';
import { BookDescription } from './book-description';
import { BookId } from './book-id';
import { BookImage } from './book-image';
import { BookName } from './book-name';
import { BookPrice } from './book-price';
import { BookAuthorChanged } from './events/book-author-changed';
import { BookCreated } from './events/book-created';
import { BookDescriptionChanged } from './events/book-description-changed';
import { BookImageChanged } from './events/book-image-changed';
export class Book extends AggregateRoot {
  public id: BookId;
  public name: BookName;
  public description: BookDescription;
  public image: BookImage;
  public author: BookAuthor;
  public price: BookPrice;

  constructor(
    id: BookId,
    name: BookName,
    description: BookDescription,
    image: BookImage,
    author: BookAuthor,
    price: BookPrice
  ) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.author = author;
    this.price = price;
  }

  static create(
    id: BookId,
    name: BookName,
    description: BookDescription,
    image: BookImage,
    author: BookAuthor,
    price: BookPrice
  ): Book {
    const book = new Book(id, name, description, image, author, price);

    console.log('📌 ~ record:');
    book.record(
      new BookCreated({
        aggregateId: book.id.value,
        name: book.name.value,
        description: book.description.value,
        image: book.image.value,
        author: book.author.value,
        price: book.price.value,
      })
    );

    return book;
  }

  public changeAuthor(author: BookAuthor) {
    this.author = author;
    this.record(
      new BookAuthorChanged({
        aggregateId: this.id.value,
        author: author.value,
      })
    );
  }

  public changeDescription(description: BookDescription) {
    this.description = description;
    this.record(
      new BookDescriptionChanged({
        aggregateId: this.id.value,
        description: description.value,
      })
    );
  }

  public changeImage(image: BookImage) {
    this.image = image;
    this.record(new BookImageChanged({ aggregateId: this.id.value, image: image.value }));
  }

  public applyBookCreated(event: BookCreated): void {
    this.id = new BookId(event.aggregateId);
    this.name = new BookName(event.name);
    this.description = new BookDescription(event.description);
    this.image = new BookImage(event.image);
    this.author = new BookAuthor(event.author);
    this.price = new BookPrice(event.price);
  }

  public applyBookAuthorChanged(event: BookAuthorChanged): void {
    this.author = new BookAuthor(event.author);
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
    author: string;
    price: number;
  }): Book {
    return new Book(
      new BookId(plainData.id),
      new BookName(plainData.name),
      new BookDescription(plainData.description),
      new BookImage(plainData.image),
      new BookAuthor(plainData.author),
      new BookPrice(plainData.price)
    );
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      description: this.description.value,
      image: this.image.value,
      author: this.author.value,
      price: this.price.value,
    };
  }
}
