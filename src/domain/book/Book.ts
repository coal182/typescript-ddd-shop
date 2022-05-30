/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AggregateRoot } from '@core/AggregateRoot';

import { BookDescription } from './BookDescription';
import { BookAuthorChanged } from './events/BookAuthorChanged';
import { BookBorrowed } from './events/BookBorrowed';
import { BookCreated } from './events/BookCreated';
import { BookDescriptionChanged } from './events/BookDescriptionChanged';
import { BookImageChanged } from './events/BookImageChanged';
export class Book extends AggregateRoot {
  public name!: string;
  public description!: BookDescription;
  public image!: string;
  public authorId!: string;
  public price!: number;
  public isBorrowed = false;

  constructor();

  constructor(guid: string, name: string, description: string, image: string, authorId: string, price: number);

  constructor(guid?: string, name?: string, description?: string, image?: string, authorId?: string, price?: number) {
    super(guid);
    // This if block is required as we instantiate the aggregate root in the repository
    if (guid && name && description && authorId && price) {
      this.applyChange(new BookCreated(this.guid, name!, description!, image!, authorId!, price!));
    }
  }

  public changeAuthor(authorId: string) {
    this.authorId = authorId;
    this.applyChange(new BookAuthorChanged(this.guid, authorId));
  }

  public changeDescription(description: string) {
    this.description = new BookDescription(description);
    this.applyChange(new BookDescriptionChanged(this.guid, description));
  }

  public changeImage(image: string) {
    this.image = image;
    this.applyChange(new BookImageChanged(this.guid, image));
  }

  public markAsBorrowed() {
    this.isBorrowed = true;
    this.applyChange(new BookBorrowed(this.guid));
  }

  public applyBookCreated(event: BookCreated): void {
    this.guid = event.guid;
    this.name = event.name;
    this.description = new BookDescription(event.description);
    this.image = event.image;
    this.authorId = event.authorId;
    this.price = event.price;
  }

  public applyBookAuthorChanged(event: BookAuthorChanged): void {
    this.authorId = event.authorId;
  }

  public applyBookDescriptionChanged(event: BookDescriptionChanged): void {
    this.description = new BookDescription(event.description);
  }

  public applyBookImageChanged(event: BookImageChanged): void {
    this.image = event.image;
  }

  public applyBookBorrowed() {
    this.isBorrowed = true;
  }
}
