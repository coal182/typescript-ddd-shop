import { BookRepository } from '../../domain/BookRepository';

export class BooksFinder {
  constructor(private bookRepository: BookRepository) {}

  async run() {
    const books = await this.bookRepository.searchAll();

    return books;
  }
}
