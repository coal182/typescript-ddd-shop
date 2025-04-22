import { provideHttpClientTesting } from '@angular/common/http/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {IdProviderService} from 'src/app/shared/services/id-provider.service';
import {BlankComponent} from 'src/app/test/blank-component';
import {MockCartService} from 'src/app/test/mock-cart-service';

import {CartComponent} from './cart.component';

import {HttpCartService} from '../../services/http-cart.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CartComponent', () => {
    const orderId = 'orderId';
    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let mockCartService: MockCartService;

    beforeEach(async () => {
        const activatedRouteStub = (): object => ({});

        mockCartService = new MockCartService();

        await TestBed.configureTestingModule({
    declarations: [CartComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([{ path: 'orders', component: BlankComponent }])],
    providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HttpCartService, useValue: mockCartService },
        {
            provide: IdProviderService,
            useValue: {
                getId: (): string => orderId,
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
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
                    street: '',
                    city: '',
                    number: 0,
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
                    street: 'Doe',
                    city: 'London',
                    number: 1,
                };

                component.checkoutForm.setValue(testCheckoutForm);
                component.onSubmit();
                expect(mockCartService.confirmCart).toHaveBeenCalledWith(component.checkoutForm, orderId);
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
