import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsEffects } from '../store/products/products.effects';
import { productReducer } from '../store/products/products.reducer';

import { ProductAlertsComponent } from './components/product-alerts/product-alerts.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { productsCountReducer } from '../store/products-count/products-count.reducer';
import { ProductsCountEffects } from '../store/products-count/products-count.effects';
import { productsCountFeatureKey } from '../store/products-count/state/model';
import { productsFeatureKey } from '../store/products/state/model';

@NgModule({
  declarations: [ProductListComponent, ProductAlertsComponent, ProductDetailsComponent],
  imports: [
    AppRoutingModule,
    SharedModule,
    StoreModule.forFeature(productsFeatureKey, productReducer),
    StoreModule.forFeature(productsCountFeatureKey, productsCountReducer),
    EffectsModule.forFeature([ProductsEffects,ProductsCountEffects]),
  ],
  exports: [ProductListComponent],
})
export class ProductsModule {}
