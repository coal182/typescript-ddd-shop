import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, switchMap, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { Cart } from '../cart/interfaces/cart';
import { HttpCartService } from '../cart/services/http-cart.service';
import { AuthService } from '../shared/auth/auth.service';
import { StorageService } from '../shared/services/storage.service';
import { LoginActions } from '../store/login/login.actions';
import { LoginSelectors } from '../store/login/login.selectors';
import { LoadingStatus } from '../store/metadata-types';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  public user_id = '';
  public cart_counter = 0;

  constructor(
    public authService: AuthService,
    public store: Store,
    public router: Router,
    public cartService: HttpCartService,
    public storageService: StorageService
  ) {}
  ngOnInit() {
    this.user_id = this.storageService.getItem('user_id');

    this.confirmLogin();

    if (this.user_id) {
      this.loadCart();
    }
  }

  confirmLogin() {
    this.store.pipe(select(LoginSelectors.selectLogin), takeUntil(this.onDestroy$)).subscribe((login) => {
      if (login.metadata.loadingStatus === LoadingStatus.Loaded) {
        if (login.access_token) {
          this.storageService.setItem('access_token', login.access_token);
          this.storageService.setItem('user_id', login.user_id);
          this.storageService.setItem('cart', JSON.stringify(login.cart));
          this.router.navigate(['products']);
          this.user_id = login.user_id;
          this.loadCart();
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

  loadCart() {
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

  logout() {
    this.store.dispatch(LoginActions.logOut());
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
