import { ElasticRepository } from '@infrastructure/persistence/elasticsearch/elastic-repository';
import { Criteria } from '@shared/domain/criteria/criteria';
import { Nullable } from '@shared/domain/nullable';

import { BackofficeProduct } from '../../domain/backoffice-product';
import { BackofficeProductId } from '../../domain/backoffice-product-id';
import { BackofficeProductRepository } from '../../domain/backoffice-product-repository';

export class ElasticBackofficeProductRepository
  extends ElasticRepository<BackofficeProduct>
  implements BackofficeProductRepository
{
  async search(id: BackofficeProductId): Promise<Nullable<BackofficeProduct>> {
    return this.searchInElastic(BackofficeProduct.fromPrimitives, id);
  }

  async searchAll(): Promise<BackofficeProduct[]> {
    return this.searchAllInElastic(BackofficeProduct.fromPrimitives);
  }

  async save(product: BackofficeProduct): Promise<void> {
    return this.persist(product.getId(), product);
  }

  async matching(criteria: Criteria): Promise<BackofficeProduct[]> {
    return this.searchByCriteria(criteria, BackofficeProduct.fromPrimitives);
  }
}
