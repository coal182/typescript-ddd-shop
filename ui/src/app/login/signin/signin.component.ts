import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/cart/cart-service/cart.service';
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
    public cartService: CartService
  ) {
    this.signinForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }
  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['products']);
      this.cartService.getItems();
    }
  }
  loginUser() {
    this.authService.signIn(this.signinForm.value);
  }
}
