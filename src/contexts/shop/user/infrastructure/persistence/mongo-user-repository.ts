import { MongoRepository } from '@infrastructure/persistence/mongo/mongo-repository';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';
import { User } from 'src/contexts/shop/user/domain/user';
import { UserId } from 'src/contexts/shop/user/domain/user-id';
import { UserRepository } from 'src/contexts/shop/user/domain/user-repository';

interface UserDocument {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  password: string;
}

export class MongoUserRepository extends MongoRepository<User> implements UserRepository {
  public save(user: User): Promise<void> {
    return this.persist(user.id.value, user);
  }

  public async search(id: UserId): Promise<Nullable<User>> {
    const collection = await this.collection();
    const document = await collection.findOne<UserDocument>({ _id: id.value });

    if (document) {
      const primitivesFromDocument = {
        id: document.id,
        email: document.email,
        firstname: document.firstname,
        lastname: document.lastname,
        dateOfBirth: document.dateOfBirth,
        password: document.password,
      };
      return document ? User.fromPrimitives(primitivesFromDocument) : null;
    }

    return null;
  }

  protected collectionName(): string {
    return 'users';
  }

  public async searchAll(): Promise<User[]> {
    const collection = await this.collection();
    const documents = await collection.find<UserDocument>({}, {}).toArray();
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        email: document.email,
        firstname: document.firstname,
        lastname: document.lastname,
        dateOfBirth: document.dateOfBirth,
        password: document.password,
      };
      return User.fromPrimitives(primitivesFromDocument);
    });
  }

  public async matching(criteria: Criteria): Promise<User[]> {
    const documents = await this.searchByCriteria<UserDocument>(criteria);
    return documents.map((document) => {
      const primitivesFromDocument = {
        id: document.id,
        email: document.email,
        firstname: document.firstname,
        lastname: document.lastname,
        dateOfBirth: document.dateOfBirth,
        password: document.password,
      };
      return User.fromPrimitives(primitivesFromDocument);
    });
  }
}
