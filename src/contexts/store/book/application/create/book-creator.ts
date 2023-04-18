import { EventBus } from '@shared/domain/EventBus';
import { Book } from '@storeback/book/domain/book';
import { BookAuthor } from '@storeback/book/domain/book-author';
import { BookDescription } from '@storeback/book/domain/book-description';
import { BookId } from '@storeback/book/domain/book-id';
import { BookImage } from '@storeback/book/domain/book-image';
import { BookName } from '@storeback/book/domain/book-name';
import { BookPrice } from '@storeback/book/domain/book-price';
import { BookEventRepository } from '@storeback/book/domain/BookEventRepository';
import { BookRepository } from '@storeback/book/domain/BookRepository';

export class BookCreator {
  constructor(
    private repository: BookRepository,
    private eventBus: EventBus,
    private eventRepository: BookEventRepository
  ) {}

  async run(params: {
    id: BookId;
    name: BookName;
    description: BookDescription;
    image: BookImage;
    author: BookAuthor;
    price: BookPrice;
  }): Promise<void> {
    console.log('📌 ~ params:', params);
    const book = Book.create(params.id, params.name, params.description, params.image, params.author, params.price);
    console.log('📌 ~ book:', book);

    const newDomainEvents = book.pullDomainEvents();
    await this.eventRepository.save(newDomainEvents);
    await this.eventBus.publish(newDomainEvents);
  }
}
