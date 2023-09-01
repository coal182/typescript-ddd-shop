import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/auth/auth.service';
import { LoginActions } from '../store/login/login.actions';
import { LoginSelectors } from '../store/login/login.selectors';
import { LoadingStatus } from '../store/metadata-types';
import { Cart } from '../cart/interfaces/cart';
import { HttpCartService } from '../cart/services/http-cart.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  public user_id = '';
  public cart_counter = 0;

  constructor(public authService: AuthService, public store: Store, public router: Router, public cartService: HttpCartService) {}
  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
    this.store.select((state) => state).subscribe((data) => console.log('store:', data));
    

    this.loadCart();

    this.loadUserMenu();
  }

  loadCart(){
    this.cartService
      .getItems()
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          return this.cartService.getCart().pipe(takeUntil(this.onDestroy$));
        })
      )
      .subscribe((cart: Cart) => {
        this.cart_counter = cart.items.length;
      });
  }

  loadUserMenu(){
    this.store.pipe(select(LoginSelectors.selectLogin), takeUntil(this.onDestroy$)).subscribe((login) => {
      if (login.metadata.loadingStatus === LoadingStatus.Loaded) {
        if (login.access_token) {
          localStorage.setItem('access_token', login.access_token);
          localStorage.setItem('user_id', login.user_id);
          localStorage.setItem('cart', JSON.stringify(login.cart));
          this.router.navigate(['products']);

          Swal.fire('Hello !', 'You have been signed up correctly! ', 'success');
        }
      }

      if (login.metadata.loadingStatus === LoadingStatus.NotLoaded) {
        if (login.metadata.error) {
          Swal.fire({
            title: 'Error',
            text: login.metadata.error.message,
            icon: 'error',
          });
        }
      }
    });
  }

  logout() {
    this.store.dispatch(LoginActions.logOut());
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
