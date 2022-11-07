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

  constructor(books: Array<BookResponse>) {
    this.books = books;
  }
}
