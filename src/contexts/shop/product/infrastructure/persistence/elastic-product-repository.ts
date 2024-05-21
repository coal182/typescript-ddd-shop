import {ElasticRepository} from '@infrastructure/persistence/elasticsearch/elastic-repository';
import {Criteria} from '@shared/domain/criteria/criteria';
import {Nullable} from '@shared/domain/nullable';

import {ProductId} from '../../../../shared/product/domain/product-id';
import {Product} from '../../../../shop/product/domain/product';
import {ProductRepository} from '../../../../shop/product/domain/product-repository';

export class ElasticProductRepository extends ElasticRepository<Product> implements ProductRepository {
    async search(id: ProductId): Promise<Nullable<Product>> {
        return this.searchInElastic(Product.fromPrimitives, id.toString());
    }

    async searchAll(): Promise<Product[]> {
        return this.searchAllInElastic(Product.fromPrimitives);
    }

    async save(product: Product): Promise<void> {
        return this.persist(product.getId(), product);
    }

    async matching(criteria: Criteria): Promise<Product[]> {
        return this.searchByCriteria(criteria, Product.fromPrimitives);
    }
}
