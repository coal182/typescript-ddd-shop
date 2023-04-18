import { Book } from '../domain/book';

export interface BookResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  author: { id: string; firstname: string; lastname: string };
  price: number;
  version: number;
}

export class BooksResponse {
  public readonly books: Array<BookResponse>;

  constructor(books: Array<Book>) {
    this.books = books.map((book) => {
      const primitives = book.toPrimitives();
      return {
        id: primitives.id,
        name: primitives.name,
        description: primitives.description,
        image: primitives.image,
        author: { id: primitives.author, firstname: 'no name yet', lastname: 'no lastname yet' },
        price: primitives.price,
        version: 0,
      };
    });
  }
}
