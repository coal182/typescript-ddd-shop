import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ProductAlertsComponent } from './product-alerts/product-alerts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';

@NgModule({
  declarations: [ProductListComponent, ProductAlertsComponent, ProductDetailsComponent],
  imports: [AppRoutingModule, SharedModule],
  exports: [ProductListComponent],
})
export class ProductsModule {}
