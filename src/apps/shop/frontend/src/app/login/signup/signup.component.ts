import {Component} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../shared/auth/auth.service';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
    signupForm: UntypedFormGroup;
    constructor(
        public fb: UntypedFormBuilder,
        public authService: AuthService,
        public router: Router,
    ) {
        this.signupForm = this.fb.group({
            name: [''],
            email: [''],
            mobile: [''],
            password: [''],
        });
    }
    registerUser(): void {
        this.authService.signUp(this.signupForm.value).subscribe((res) => {
            if (res.result) {
                this.signupForm.reset();
                this.router.navigate(['log-in']);
            }
        });
    }
}
