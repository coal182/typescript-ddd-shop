import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {NgxCoalModule} from 'ngx-coal';

import {ProductAlertsComponent} from './components/product-alerts/product-alerts.component';
import {ProductDetailsComponent} from './pages/product-details/product-details.component';
import {ProductListComponent} from './pages/product-list/product-list.component';

import {AppRoutingModule} from '../app-routing.module';
import {ProductReviewsModule} from '../product-reviews/product-reviews.module';
import {SharedModule} from '../shared/shared.module';
import {ProductsEffects} from '../store/products/products.effects';
import {productReducer} from '../store/products/products.reducer';
import {productsFeatureKey} from '../store/products/state/model';
import {ProductsCountEffects} from '../store/products-count/products-count.effects';
import {productsCountReducer} from '../store/products-count/products-count.reducer';
import {productsCountFeatureKey} from '../store/products-count/state/model';

@NgModule({
    declarations: [ProductListComponent, ProductAlertsComponent, ProductDetailsComponent],
    imports: [
        AppRoutingModule,
        SharedModule,
        ProductReviewsModule,
        StoreModule.forFeature(productsFeatureKey, productReducer),
        StoreModule.forFeature(productsCountFeatureKey, productsCountReducer),
        EffectsModule.forFeature([ProductsEffects, ProductsCountEffects]),
        NgxCoalModule,
    ],
    exports: [ProductListComponent],
})
export class ProductsModule {}
