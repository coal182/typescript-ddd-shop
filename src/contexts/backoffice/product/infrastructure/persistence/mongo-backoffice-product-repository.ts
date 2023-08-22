import { MongoRepository } from '@infrastructure/persistence/mongo/mongo-repository';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';

import { BackofficeProduct } from '../../domain/backoffice-product';
import { BackofficeProductId } from '../../domain/backoffice-product-id';
import { BackofficeProductRepository } from '../../domain/backoffice-product-repository';

interface ProductDocument {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  brand: string;
  category: string;
  ean: string;
}

export class MongoBackofficeProductRepository
  extends MongoRepository<BackofficeProduct>
  implements BackofficeProductRepository
{
  public async search(id: BackofficeProductId): Promise<Nullable<BackofficeProduct>> {
    const collection = await this.collection();
    const document = await collection.findOne<ProductDocument>({ id: id.value });

    if (document) {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        price: document.price,
        brand: document.brand,
        category: document.category,
        ean: document.ean,
      };
      return document ? BackofficeProduct.fromPrimitives(primitivesFromDocument) : null;
    }

    return null;
  }

  public save(product: BackofficeProduct): Promise<void> {
    return this.persist(product.id.value, product);
  }

  protected collectionName(): string {
    return 'backoffice_products';
  }

  public async searchAll(): Promise<BackofficeProduct[]> {
    const collection = await this.collection();
    const documents = await collection.find<ProductDocument>({}, {}).toArray();
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        price: document.price,
        brand: document.brand,
        category: document.category,
        ean: document.ean,
      };
      return BackofficeProduct.fromPrimitives(primitivesFromDocument);
    });
  }

  public async matching(criteria: Criteria): Promise<BackofficeProduct[]> {
    const documents = await this.searchByCriteria<ProductDocument>(criteria);
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        name: document.name,
        description: document.description,
        image: document.image,
        price: document.price,
        brand: document.brand,
        category: document.category,
        ean: document.ean,
      };
      return BackofficeProduct.fromPrimitives(primitivesFromDocument);
    });
  }
}