import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/auth/auth.service';
import { LoginActions } from '../store/login/login.actions';
import { LoginSelectors } from '../store/login/login.selectors';
import { LoadingStatus } from '../store/metadata-types';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnDestroy {
  private destroyed$ = new Subject<boolean>();

  public user_id = '';

  constructor(public authService: AuthService, public store: Store, public router: Router) {}
  ngOnInit() {
    this.user_id = localStorage.getItem('user_id');
    this.store.select((state) => state).subscribe((data) => console.log('store:', data));

    this.store.pipe(select(LoginSelectors.selectLogin), takeUntil(this.destroyed$)).subscribe((login) => {
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
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
