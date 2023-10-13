import { createAction, props } from '@ngrx/store';


export class ProductsCountActions {

  public static fetchProductsCount = createAction('[Products] Fetch products count');

  public static fetchProductsCountSuccess = createAction(
    '[Products] Fetch products count Success',
    props<{ count: number }>()
  );

  public static fetchProductsCountFailure = createAction(
    '[Products] Fetch products count Failure',
    props<{ error: Error }>()
  );
}
