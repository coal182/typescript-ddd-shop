import { Component, OnInit, Renderer2 } from '@angular/core';
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
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private renderer2: Renderer2
  ) {
    this.signinForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }
  ngOnInit() {
    this.renderer2.addClass(document.body.parentElement, 'animated_bg');
    this.renderer2.addClass(document.body, 'animated_bg');
    if (this.authService.isLoggedIn) {
      this.router.navigate(['products']);
    }
  }
  loginUser() {
    this.authService.signIn(this.signinForm.value);
  }

  ngOnDestroy() {
    this.renderer2.removeClass(document.body.parentElement, 'animated_bg');
    this.renderer2.removeClass(document.body, 'animated_bg');
  }
}
