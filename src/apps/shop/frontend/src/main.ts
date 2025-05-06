import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {authInterceptor} from './app/shared/auth/authconfig.interceptor';
import {IdProviderService} from './app/shared/services/id-provider.service';
import {provideSwalPopupService} from './app/shared/services/popup/swal-popup-service';
import {ValidationService} from './app/shared/services/validation.service';
import {SharedModule} from './app/shared/shared.module';
import {LoginEffects} from './app/store/login/login.effects';
import {loginReducer} from './app/store/login/login.reducer';
import {ProductsEffects} from './app/store/products/products.effects';
import {productReducer} from './app/store/products/products.reducer';
import {productsFeatureKey} from './app/store/products/state/model';
import {ProductsCountEffects} from './app/store/products-count/products-count.effects';
import {productsCountReducer} from './app/store/products-count/products-count.reducer';
import {productsCountFeatureKey} from './app/store/products-count/state/model';

bootstrapApplication(AppComponent, {
    providers: [
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes, withComponentInputBinding()),
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideSwalPopupService(),
        ValidationService,
        IdProviderService,
        importProvidersFrom(SharedModule),
        importProvidersFrom(StoreModule.forRoot({}, {})),
        importProvidersFrom(EffectsModule.forRoot([])),

        importProvidersFrom(StoreModule.forFeature(productsFeatureKey, productReducer)),
        importProvidersFrom(StoreModule.forFeature(productsCountFeatureKey, productsCountReducer)),
        importProvidersFrom(EffectsModule.forFeature([ProductsEffects, ProductsCountEffects])),
        importProvidersFrom(StoreModule.forFeature('login', loginReducer)),
        importProvidersFrom(EffectsModule.forFeature([LoginEffects])),
    ],
    // eslint-disable-next-line no-console
}).catch((err) => console.error(err));
