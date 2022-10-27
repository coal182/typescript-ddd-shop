import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsEffects } from '../store/products/products.effects';
import { productReducer } from '../store/products/products.reducer';

import { ProductAlertsComponent } from './product-alerts/product-alerts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [ProductListComponent, ProductAlertsComponent, ProductDetailsComponent],
  imports: [
    AppRoutingModule,
    SharedModule,
    StoreModule.forFeature('products', productReducer),
    EffectsModule.forFeature([ProductsEffects]),
  ],
  exports: [ProductListComponent],
})
export class ProductsModule {}
