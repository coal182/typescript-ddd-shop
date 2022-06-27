import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockRouter } from '../test/mock-router';

import { CartComponent } from './cart.component';
import { CartService } from './cart-service/cart.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    const formBuilderStub = () => ({group: object => ({})});
    const activatedRouteStub = () => ({});
    let mockRouter: MockRouter;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ CartComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: mockRouter },
        { provide: FormBuilder, useFactory: formBuilderStub},  
        CartService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
