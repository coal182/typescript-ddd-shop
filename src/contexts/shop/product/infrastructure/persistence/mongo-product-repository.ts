import { MongoRepository } from '@infrastructure/persistence/mongo/mongo-repository';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';
import { Product } from 'src/contexts/shop/product/domain/product';
import { ProductId } from 'src/contexts/shop/product/domain/product-id';
import { ProductRepository } from 'src/contexts/shop/product/domain/product-repository';

interface ProductDocument {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
}

export class MongoProductRepository extends MongoRepository<Product> implements ProductRepository {
  public save(product: Product): Promise<void> {
    return this.persist(product.id.value, product);
  }

  public async search(id: ProductId): Promise<Nullable<Product>> {
    const collection = await this.collection();
    const document = await collection.findOne<ProductDocument>({ id: id.value });

    if (document) {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        price: document.price,
      };
      return document ? Product.fromPrimitives(primitivesFromDocument) : null;
    }

    return null;
  }

  protected collectionName(): string {
    return 'products';
  }

  public async searchAll(): Promise<Product[]> {
    const collection = await this.collection();
    const documents = await collection.find<ProductDocument>({}, {}).toArray();
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        price: document.price,
      };
      return Product.fromPrimitives(primitivesFromDocument);
    });
  }

  public async matching(criteria: Criteria): Promise<Product[]> {
    const documents = await this.searchByCriteria<ProductDocument>(criteria);
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        price: document.price,
      };
      return Product.fromPrimitives(primitivesFromDocument);
    });
  }
}
