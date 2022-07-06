import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
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
  checkoutForm = this.formBuilder.group({
    name: '',
    address: '',
  });

  constructor(
    private cartService: HttpCartService,
    private formBuilder: FormBuilder
  ) {
    
    this.items = [];
    
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
    this.items = this.cartService.clearCart();
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item).pipe(
      catchError((error: HttpErrorResponse): Observable<Error> => {
        return throwError(() => error);
      })
    )
    .subscribe((res: any) => {
      this.cartService.cart.version = this.cartService.cart.version+1;
      this.items = this.items.filter(it => it.product._id !== item.product._id);
      Swal.fire({
        title: 'Product removed', 
        html: 'Your product has been removed from cart!', 
        icon: 'success', 
        toast: true, 
        position: 'top-right',
        iconColor: '#286f00',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });  
      

    });  

  }

}
