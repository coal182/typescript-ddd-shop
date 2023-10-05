import { MongoRepository } from '@infrastructure/persistence/mongo/mongo-repository';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';
import { Cart } from 'src/contexts/shop/cart/domain/cart';
import { CartId } from 'src/contexts/shop/cart/domain/cart-id';
import { CartRepository } from 'src/contexts/shop/cart/domain/cart-repository';

interface CartItemDocument {
  productId: string;
  qty: number;
  price: number;
}

interface CartDocument {
  id: string;
  userId: string;
  items: Array<CartItemDocument>;
}

export class MongoCartRepository extends MongoRepository<Cart> implements CartRepository {
  public save(cart: Cart): Promise<void> {
    return this.persist(cart.getId(), cart);
  }

  public async search(id: CartId): Promise<Nullable<Cart>> {
    const collection = await this.collection();
    const document = await collection.findOne<CartDocument>({ _id: id.value });

    if (document) {
      const primitivesFromDocument = {
        id: document.id,
        userId: document.userId,
        items: document.items,
      };
      return document ? Cart.fromPrimitives(primitivesFromDocument) : null;
    }

    return null;
  }

  protected collectionName(): string {
    return 'shop_carts';
  }

  public async searchAll(): Promise<Cart[]> {
    const collection = await this.collection();
    const documents = await collection.find<CartDocument>({}, {}).toArray();
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        userId: document.userId,
        items: document.items,
      };
      return Cart.fromPrimitives(primitivesFromDocument);
    });
  }

  public async matching(criteria: Criteria): Promise<Cart[]> {
    const documents = await this.searchByCriteria<CartDocument>(criteria);
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        userId: document.userId,
        items: document.items,
      };
      return Cart.fromPrimitives(primitivesFromDocument);
    });
  }
}
