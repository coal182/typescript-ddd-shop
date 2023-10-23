import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SigninComponent } from './login/signin/signin.component';
import { SignupComponent } from './login/signup/signup.component';
import { ShippingComponent } from './shipping/shipping.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AppComponent, ShippingComponent, UserProfileComponent, SigninComponent, SignupComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });
  it('should create the component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
