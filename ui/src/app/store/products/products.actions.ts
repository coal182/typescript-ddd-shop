import { createAction, props } from '@ngrx/store';

import { Product } from 'src/app/products/products';

export class ProductsActions {
  public static fetchProducts = createAction('[Products] Fetch products');

  public static fetchProductsSuccess = createAction(
    '[Products] Fetch products Success',
    props<{ products: ReadonlyArray<Product> }>()
  );

  public static fetchProductsFailure = createAction('[Products] Fetch products Failure', props<{ error: Error }>());

  public static fetchSingleProduct = createAction('[Products] Fetch single product', props<{ id: string }>());

  public static fetchSingleProductSuccess = createAction(
    '[Products] Fetch single product Success',
    props<{ product: Product }>()
  );

  public static fetchSingleProductFailure = createAction(
    '[Products] Fetch single product Failure',
    props<{ error: Error }>()
  );
}
