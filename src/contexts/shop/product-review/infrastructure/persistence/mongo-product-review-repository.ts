import { MongoRepository } from '@infrastructure/persistence/mongo/mongo-repository';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';
import { ProductReview } from 'src/contexts/shop/product-review/domain/product-review';
import { ProductReviewId } from 'src/contexts/shop/product-review/domain/product-review-id';
import { ProductReviewRepository } from 'src/contexts/shop/product-review/domain/product-review-repository';

interface ProductReviewDocument {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export class MongoProductReviewRepository extends MongoRepository<ProductReview> implements ProductReviewRepository {
  public save(productReview: ProductReview): Promise<void> {
    return this.persist(productReview.getId(), productReview);
  }

  public async search(id: ProductReviewId): Promise<Nullable<ProductReview>> {
    const collection = await this.collection();
    const document = await collection.findOne<ProductReviewDocument>({ id: id.value });

    if (document) {
      const primitivesFromDocument = {
        id: document.id,
        productId: document.productId,
        userId: document.userId,
        rating: document.rating,
        comment: document.comment,
        createdAt: document.createdAt,
      };
      return document ? ProductReview.fromPrimitives(primitivesFromDocument) : null;
    }

    return null;
  }

  protected collectionName(): string {
    return 'product_reviews';
  }

  public async searchAll(): Promise<ProductReview[]> {
    const collection = await this.collection();
    const documents = await collection.find<ProductReviewDocument>({}, {}).toArray();
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        productId: document.productId,
        userId: document.userId,
        rating: document.rating,
        comment: document.comment,
        createdAt: document.createdAt,
      };
      return ProductReview.fromPrimitives(primitivesFromDocument);
    });
  }

  public async matching(criteria: Criteria): Promise<ProductReview[]> {
    const documents = await this.searchByCriteria<ProductReviewDocument>(criteria);
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        productId: document.productId,
        userId: document.userId,
        rating: document.rating,
        comment: document.comment,
        createdAt: document.createdAt,
      };
      return ProductReview.fromPrimitives(primitivesFromDocument);
    });
  }
}
