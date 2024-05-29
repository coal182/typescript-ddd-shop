import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {LoginActions} from 'src/app/store/login/login.actions';
import {Credentials} from 'src/app/store/login/state/model';

import {AuthService} from '../../shared/auth/auth.service';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {
    signinForm: UntypedFormGroup;
    public isLoading = false;

    constructor(
        public fb: UntypedFormBuilder,
        public authService: AuthService,
        public router: Router,
        private renderer2: Renderer2,
        private store: Store,
    ) {
        this.signinForm = this.fb.group({
            email: [''],
            password: [''],
        });
    }
    ngOnInit(): void {
        this.renderer2.addClass(document.body.parentElement, 'animated_bg');
        this.renderer2.addClass(document.body, 'animated_bg');
        if (this.authService.isLoggedIn) {
            this.router.navigate(['products']);
        }
    }
    loginUser(): void {
        const credentials: Credentials = {
            email: this.signinForm.value['email'].toString(),
            password: this.signinForm.value['password'].toString(),
        };

        this.store.dispatch(LoginActions.signIn({credentials}));
    }

    ngOnDestroy(): void {
        this.renderer2.removeClass(document.body.parentElement, 'animated_bg');
        this.renderer2.removeClass(document.body, 'animated_bg');
    }
}
