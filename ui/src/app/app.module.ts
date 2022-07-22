import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Interceptors

import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartModule } from './cart/cart.module';
import { FinderComponent } from './finder/finder.component';
import { SigninComponent } from './login/signin/signin.component';
import { SignupComponent } from './login/signup/signup.component';
import { ProductsModule } from './products/products.module';
import { AuthInterceptor } from './shared/auth/authconfig.interceptor';
import { ValidationService } from './shared/services/validation.service';
import { SharedModule } from './shared/shared.module';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailsComponent } from './orders/order-details/order-details.component';
import { OrdersModule } from './orders/orders.module';

@NgModule({
  imports: [HttpClientModule, AppRoutingModule, SharedModule, ProductsModule, CartModule, OrdersModule],
  declarations: [
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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ValidationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
