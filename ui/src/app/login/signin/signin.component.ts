import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../../shared/auth/auth.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router) {
    this.signinForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }
  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['products']);
    }
  }
  loginUser() {
    this.authService.signIn(this.signinForm.value);
  }
}
