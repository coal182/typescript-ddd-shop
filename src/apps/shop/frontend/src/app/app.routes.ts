import {Routes} from '@angular/router';

import {CartComponent} from './cart/pages/cart/cart.component';
import {SigninComponent} from './login/signin/signin.component';
import {SignupComponent} from './login/signup/signup.component';
import {OrderDetailsComponent} from './orders/pages/order-details/order-details.component';
import {OrderListComponent} from './orders/pages/order-list/order-list.component';
import {ProductDetailsComponent} from './products/pages/product-details/product-details.component';
import {ProductListComponent} from './products/pages/product-list/product-list.component';
import {AuthGuard} from './shared/auth/auth.guard';
import {ShippingComponent} from './shipping/shipping.component';
import {UserProfileComponent} from './user/user-profile/user-profile.component';

export const routes: Routes = [
    {path: '', redirectTo: '/log-in', pathMatch: 'full'},
    {path: 'log-in', component: SigninComponent},
    {path: 'sign-up', component: SignupComponent},
    {
        path: 'user-profile/:id',
        component: UserProfileComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'products',
        component: ProductListComponent,
        canActivate: [AuthGuard],
    },
    {path: 'products/:productId', component: ProductDetailsComponent},
    {path: 'cart', component: CartComponent},
    {path: 'orders', component: OrderListComponent},
    {path: 'orders/:orderId', component: OrderDetailsComponent},
    {path: 'shipping', component: ShippingComponent},
];
