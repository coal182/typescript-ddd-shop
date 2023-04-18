import { DomainEventClass } from '@shared/domain/DomainEvent';
import { DomainEventSubscriber } from '@shared/domain/DomainEventSubscriber';
import { Book } from '@storeback/book/domain/book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookId } from '@storeback/book/domain/book-id';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';
import { BookRepository } from '@storeback/book/domain/BookRepository';
import { BookCreated } from '@storeback/book/domain/events/book-created';

export class BookCreatedEventHandler implements DomainEventSubscriber<BookCreated> {
  public event = BookCreated.name;

  constructor(private repository: BookRepository) {}

  subscribedTo(): DomainEventClass[] {
    return [BookCreated];
  }

  async on(domainEvent: BookCreated): Promise<void> {
    console.log('📌 ~ domainEvent:', domainEvent);
    const id = new BookId(domainEvent.aggregateId);
    const name = new BookName(domainEvent.name);
    const description = new BookDescription(domainEvent.description);
    const image = new BookImage(domainEvent.image);
    const author = new BookAuthor(domainEvent.author);
    const price = new BookPrice(domainEvent.price);

    const book = Book.create(id, name, description, image, author, price);
    await this.repository.save(book);
  }
}
