import { ProductCategory } from 'src/contexts/shop/product/domain/product-category';
import { WordMother } from 'test/contexts/shared/word-mother';

export class ProductCategoryMother {
  static create(value: string): ProductCategory {
    return new ProductCategory(value);
  }

  static random(): ProductCategory {
    return this.create(WordMother.random());
  }

  static invalidCategory(): string {
    return 'a'.repeat(201);
  }
}
