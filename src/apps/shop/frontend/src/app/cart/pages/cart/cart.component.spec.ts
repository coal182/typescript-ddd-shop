import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';


import { CartComponent } from './cart.component';
import { MockCartService } from 'src/app/test/mock-cart-service';
import { MockRouter } from 'src/app/test/mock-router';
import { HttpCartService } from '../../services/http-cart.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockRouter: MockRouter;
  let mockCartService: MockCartService;

  beforeEach(async () => {
    const activatedRouteStub = () => ({});

    mockCartService = new MockCartService();

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CartComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: mockRouter },
        { provide: HttpCartService, useValue: mockCartService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user submit the form', () => {
    describe('and fields are not valid', () => {
      beforeEach(async () => {
        initializeComponent();
      });

      it('should not allow submitting the form', async () => {
        const testInvalidCheckoutForm = {
          name: 'Jon55657',
          address: '',
        };
        component.checkoutForm.setValue(testInvalidCheckoutForm);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('[data-testid=submit-button]')).nativeElement.click();
        fixture.detectChanges();
        expect(mockCartService.clearCart).not.toHaveBeenCalled();
      });
    });

    describe('and fields are valid', () => {
      it('should call CartService with expected params', () => {
        const testCheckoutForm = {
          name: 'Jon',
          address: 'C/ Doe 1',
        };

        component.checkoutForm.setValue(testCheckoutForm);
        component.onSubmit();
        expect(mockCartService.confirmCart).toHaveBeenCalledWith(component.checkoutForm);
      });
    });
  });

  async function initializeComponent(): Promise<void> {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  }
});
