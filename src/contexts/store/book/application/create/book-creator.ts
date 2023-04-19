import { EventBus } from '@shared/domain/EventBus';
import { Book } from '@storeback/book/domain/book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookId } from '@storeback/book/domain/book-id';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';
import { BookEventStore } from '@storeback/book/domain/BookEventStore';

export class BookCreator {
  constructor(private eventBus: EventBus, private eventStore: BookEventStore) {}

  async run(params: {
    id: BookId;
    name: BookName;
    description: BookDescription;
    image: BookImage;
    author: BookAuthor;
    price: BookPrice;
  }): Promise<void> {
    const book = Book.create(params.id, params.name, params.description, params.image, params.author, params.price);

    const newDomainEvents = book.pullDomainEvents();
    await this.eventStore.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
