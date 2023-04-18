import { MongoRepository } from '@infrastructure/persistence/mongo/MongoRepository';
import { Criteria } from '@shared/domain/criteria/Criteria';
import { Nullable } from '@shared/domain/Nullable';
import { Book } from '@storeback/book/domain/book';
import { BookId } from '@storeback/book/domain/book-id';
import { BookRepository } from '@storeback/book/domain/BookRepository';

interface BookDocument {
  id: string;
  name: string;
  description: string;
  image: string;
  author: string;
  price: number;
}

export class MongoBookRepository extends MongoRepository<Book> implements BookRepository {
  public save(book: Book): Promise<void> {
    return this.persist(book.id.value, book);
  }

  public async search(id: BookId): Promise<Nullable<Book>> {
    const collection = await this.collection();
    const document = await collection.findOne<BookDocument>({ _id: id.value });

    if (document) {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        author: document.author,
        price: document.price,
      };
      return document ? Book.fromPrimitives(primitivesFromDocument) : null;
    }

    return null;
  }

  protected collectionName(): string {
    return 'books';
  }

  public async searchAll(): Promise<Book[]> {
    const collection = await this.collection();
    const documents = await collection.find<BookDocument>({}, {}).toArray();
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        author: document.author,
        price: document.price,
      };
      return Book.fromPrimitives(primitivesFromDocument);
    });
  }

  public async matching(criteria: Criteria): Promise<Book[]> {
    const documents = await this.searchByCriteria<BookDocument>(criteria);
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        author: document.author,
        price: document.price,
      };
      return Book.fromPrimitives(primitivesFromDocument);
    });
  }
}
