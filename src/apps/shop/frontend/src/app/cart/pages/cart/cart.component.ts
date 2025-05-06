import {CurrencyPipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTable, MatTableModule} from '@angular/material/table';
import {Router, RouterModule} from '@angular/router';
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
    imports: [MatTableModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, RouterModule, CurrencyPipe, MatButtonModule, MatIconModule, ImagePipe],
})
export class CartComponent implements OnInit, OnDestroy {
    private onDestroy$: Subject<void> = new Subject();

    items: CartItem[];
    total: number;
    columnsToDisplay = ['image', 'name', 'qty', 'price', 'actions'];
    @ViewChild(MatTable) table!: MatTable<CartItem>;
    checkoutForm: UntypedFormGroup;
    namesRegex = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
    numberRegex = new RegExp(/^-?(0|[1-9]\d*)?$/u);

    constructor(
        private cartService: HttpCartService,
        private fb: UntypedFormBuilder,
        private router: Router,
        private idProvider: IdProviderService,
    ) {
        this.items = [];

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
                    cart.items.map((item: CartItem) => {
                        this.items.push(item);
                    });
                    this.table.renderRows();
                }),
                switchMap(() => {
                    return this.cartService.getCart().pipe(takeUntil(this.onDestroy$));
                }),
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
        // Process checkout data here
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
                catchError((error: HttpErrorResponse): Observable<Error> => {
                    return throwError(() => error);
                }),
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
                    customClass: {
                        popup: 'colored-toast',
                    },
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            });
    }
}
