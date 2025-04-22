import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AlertDialogComponent} from './alert-dialog/alert-dialog.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CartModule} from './cart/cart.module';
import {FinderComponent} from './finder/finder.component';
import {SigninComponent} from './login/signin/signin.component';
import {SignupComponent} from './login/signup/signup.component';
import {OrdersModule} from './orders/orders.module';
import {OrderDetailsComponent} from './orders/pages/order-details/order-details.component';
import {OrderListComponent} from './orders/pages/order-list/order-list.component';
import {ProductsModule} from './products/products.module';
import {AuthInterceptor} from './shared/auth/authconfig.interceptor';
import {IdProviderService} from './shared/services/id-provider.service';
import {PopupService} from './shared/services/popup/popup-service';
import {SwalPopupService} from './shared/services/popup/swal-popup-service';
import {ValidationService} from './shared/services/validation.service';
import {SharedModule} from './shared/shared.module';
import {LoginEffects} from './store/login/login.effects';
import {loginReducer} from './store/login/login.reducer';
import {TopBarComponent} from './top-bar/top-bar.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';

@NgModule({ declarations: [
        AppComponent,
        TopBarComponent,
        AlertDialogComponent,
        FinderComponent,
        SigninComponent,
        SignupComponent,
        UserProfileComponent,
        OrderListComponent,
        OrderDetailsComponent,
    ],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        SharedModule,
        ProductsModule,
        CartModule,
        OrdersModule,
        StoreModule.forRoot({}, {}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature('login', loginReducer),
        EffectsModule.forFeature([LoginEffects])], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        { provide: PopupService, useClass: SwalPopupService },
        ValidationService,
        IdProviderService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
