import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

import { Cart, CartItem } from './cart';
import { GetCartResponse, HttpCartService } from './cart-service/http-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  items: CartItem[];
  columnsToDisplay = ['name', 'qty', 'price', 'actions'];
  @ViewChild(MatTable) table!: MatTable<CartItem>;
  checkoutForm: FormGroup;
  namesRegex = new RegExp(
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
  );

  constructor(private cartService: HttpCartService, private fb: FormBuilder, private router: Router) {
    this.items = [];

    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.namesRegex)]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cartService.getItems().subscribe((cart: Cart) => {
      this.cartService.cart = cart;
      cart.items.map((item: CartItem) => {
        this.items.push(item);
      });
      this.table.renderRows();
    });
  }

  onSubmit(): void {
    // Process checkout data here
    console.warn('Your order has been submitted', this.checkoutForm.value);
    const orderId = uuidv4();
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
        })
      )
      .subscribe(() => {
        this.cartService.cart.version = this.cartService.cart.version + 1;
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
