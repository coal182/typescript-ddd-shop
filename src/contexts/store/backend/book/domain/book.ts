/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AggregateRoot } from '@core/aggregate-root';
import { Primitives } from '@shared/value-objects/primitives-type';

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
  public guid: BookId;
  public name: BookName;
  public description: BookDescription;
  public image: BookImage;
  public authorId: BookAuthor;
  public price: BookPrice;

  constructor();

  constructor({
    guid,
    name,
    description,
    image,
    authorId,
    price,
  }: {
    guid: BookId;
    name: BookName;
    description: BookDescription;
    image: BookImage;
    authorId: BookAuthor;
    price: BookPrice;
  });

  constructor({
    guid,
    name,
    description,
    image,
    authorId,
    price,
  }: {
    guid?: BookId;
    name?: BookName;
    description?: BookDescription;
    image?: BookImage;
    authorId?: BookAuthor;
    price?: BookPrice;
  } = {}) {
    super();
    // This if block is required as we instantiate the aggregate root in the repository
    if (guid && name && description && image && authorId && price) {
      this.applyChange(
        new BookCreated(guid.value!, name.value!, description.value!, image.value!, authorId.value!, price.value!)
      );
    }
  }

  public changeAuthor(authorId: BookAuthor) {
    this.authorId = authorId;
    this.applyChange(new BookAuthorChanged(this.guid.value, authorId.value));
  }

  public changeDescription(description: BookDescription) {
    this.description = description;
    this.applyChange(new BookDescriptionChanged(this.guid.value, description.value));
  }

  public changeImage(image: BookImage) {
    this.image = image;
    this.applyChange(new BookImageChanged(this.guid.value, image.value));
  }

  public applyBookCreated(event: BookCreated): void {
    this.guid = new BookId(event.guid);
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
    guid: string;
    name: string;
    description: string;
    image: string;
    authorId: string;
    price: number;
  }): Book {
    return new Book({
      guid: new BookId(plainData.guid),
      name: new BookName(plainData.name),
      description: new BookDescription(plainData.description),
      image: new BookImage(plainData.image),
      authorId: new BookAuthor(plainData.authorId),
      price: new BookPrice(plainData.price),
    });
  }

  toPrimitives(): Primitives<Book> {
    return {
      guid: this.guid.value,
      name: this.name.value,
      description: this.description.value,
      image: this.image.value,
      authorId: this.authorId.value,
      price: this.price.value,
    };
  }
}
