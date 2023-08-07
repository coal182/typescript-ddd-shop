import { MongoRepository } from '@infrastructure/persistence/mongo/mongo-repository';
import { Nullable } from '@shared/domain/nullable';

import { ProductsCounter } from '../../../domain/products-counter';
import { ProductsCounterRepository } from '../../../domain/products-counter-repository';

interface ProductsCounterDocument {
  _id: string;
  total: number;
  existingProducts: string[];
}

export class MongoProductsCounterRepository
  extends MongoRepository<ProductsCounter>
  implements ProductsCounterRepository
{
  protected collectionName(): string {
    return 'products_counter';
  }

  public save(counter: ProductsCounter): Promise<void> {
    return this.persist(counter.id.value, counter);
  }

  public async search(): Promise<Nullable<ProductsCounter>> {
    const collection = await this.collection();

    const document = await collection.findOne<ProductsCounterDocument>({});
    return document ? ProductsCounter.fromPrimitives({ ...document, id: document._id }) : null;
  }
}
