import {CurrencyPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {NgIconComponent} from '@ng-icons/core';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmFieldImports} from '@spartan-ng/helm/field';
import {HlmInputImports} from '@spartan-ng/helm/input';
import {HlmLabelImports} from '@spartan-ng/helm/label';
import {HlmTableImports} from '@spartan-ng/helm/table';
import {HlmTooltipImports} from '@spartan-ng/helm/tooltip';
import {catchError, Observable, Subject, switchMap, takeUntil, tap, throwError} from 'rxjs';
import {ImagePipe} from 'src/app/shared/pipes/image.pipe';
import {IdProviderService} from 'src/app/shared/services/id-provider.service';
import Swal from 'sweetalert2';

import {Cart, CartItem} from '../../interfaces/cart';
import {HttpCartService} from '../../services/http-cart.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css'],
    imports: [
        ReactiveFormsModule,
        RouterModule,
        CurrencyPipe,
        ImagePipe,
        NgIconComponent,
        ...HlmTableImports,
        ...HlmFieldImports,
        ...HlmInputImports,
        ...HlmLabelImports,
        ...HlmButtonImports,
        ...HlmTooltipImports,
    ],
})
export class CartComponent implements OnInit, OnDestroy {
    private onDestroy$: Subject<void> = new Subject();

    items: CartItem[] = [];
    total: number;
    checkoutForm: UntypedFormGroup;
    readonly namesRegex = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
    readonly numberRegex = new RegExp(/^-?(0|[1-9]\d*)?$/u);

    constructor(
        private cartService: HttpCartService,
        private fb: UntypedFormBuilder,
        private router: Router,
        private idProvider: IdProviderService,
    ) {
        this.checkoutForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern(this.namesRegex)]],
            street: ['', [Validators.required]],
            city: ['', [Validators.required]],
            number: ['', [Validators.required, Validators.pattern(this.numberRegex)]],
        });
    }

    ngOnInit(): void {
        this.cartService
            .getItems()
            .pipe(
                takeUntil(this.onDestroy$),
                tap((cart) => {
                    cart.items.forEach((item: CartItem) => this.items.push(item));
                }),
                switchMap(() => this.cartService.getCart().pipe(takeUntil(this.onDestroy$))),
            )
            .subscribe((cart: Cart) => {
                this.total = cart.total;
            });
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    onSubmit(): void {
        const orderId = this.idProvider.getId();
        this.cartService.confirmCart(this.checkoutForm, orderId).subscribe(() => {
            this.cartService.clearCart().subscribe(() => {
                this.items = [];
                this.checkoutForm.reset();
                this.router.navigateByUrl('/orders');
            });
        });
    }

    removeFromCart(item: CartItem): void {
        this.cartService
            .removeFromCart(item)
            .pipe(
                catchError((error: HttpErrorResponse): Observable<Error> => throwError(() => error)),
            )
            .subscribe(() => {
                this.items = this.items.filter((it) => it.product.id !== item.product.id);
                Swal.fire({
                    title: 'Product removed',
                    html: 'Your product has been removed from cart!',
                    icon: 'success',
                    toast: true,
                    position: 'top-right',
                    iconColor: '#286f00',
                    customClass: {popup: 'colored-toast'},
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            });
    }
}
