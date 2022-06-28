import { EventEmitter, Injectable, Output } from '@angular/core';
import { catchError, filter, firstValueFrom, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  CartService,
  GetCartParams,
} from './cart.service';

import { Product } from '../../products/products';
import { AddToCartParams, Cart, CartItem } from '../cart';
import { StatusCodes } from 'http-status-codes';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class HttpCartService extends CartService {
  items: CartItem[] = []; 
  cart: Cart; 

  public constructor(private http: HttpClient) {
    super();
  }

  public getItems(): CartItem[] {
    this.items = [];
    const userId = localStorage.getItem('user_id');
    this.http.get(
      `https://ts-bookstore-api.herokuapp.com/api/v1/cart/user/${userId}`
    ).subscribe((data: GetCartResponse) => {
      data.data.items.map((item: CartItem) => {
        this.items.push(item);
      });

      this.cart = data.data;
      
    });
    console.log(this.items);
    return this.items;
  }

  addToCart(product: Observable<Product>): void {
    product.pipe(
      map((pro): CartItem => ({product: pro, qty: 1, price: pro.price }))
    ).subscribe((item: CartItem) => {

      const params: AddToCartParams = {
        guid: this.cart._id,
        bookId: item.product._id,
        qty: item.qty,
        price: item.price,
        originalVersion: this.cart.version
      }
      
      this.http
        .post<any>(`https://ts-bookstore-api.herokuapp.com/api/v1/cart/add`, params)
        .pipe(
          catchError((error: HttpErrorResponse): Observable<Error> => {
            if (error.status === StatusCodes.UNAUTHORIZED) {
              Swal.fire(
                'Error!',
                'There was an error adding this product!',
                'error'
              );
            }
            return throwError(() => error);
          })
        )
        .subscribe((res: any) => {
          this.cart.version = this.cart.version+1;          
          this.items.push(item);

          Swal.fire('Product added', 'Your product has been added to the cart!', 'success'); 
        
        });

    });
    
  }

  removeFromCart(item: CartItem): CartItem[] {
    const params: AddToCartParams = {
      guid: this.cart._id,
      bookId: item.product._id,
      qty: item.qty,
      price: item.price,
      originalVersion: this.cart.version
    }

    this.http
      .delete<any>(`https://ts-bookstore-api.herokuapp.com/api/v1/cart/remove/${params.guid}/${params.bookId}/${params.qty}/${params.price}/${params.originalVersion}`)
      .pipe(
        catchError((error: HttpErrorResponse): Observable<Error> => {
          return throwError(() => error);
        })
      )
      .subscribe((res: any) => {
        this.cart.version = this.cart.version+1;
        this.items = this.items.filter(it => it.product._id !== item.product._id);
        Swal.fire(
          'Success!',
          'Your product has been removed from cart!',
          'success'
        );  

      });
    return this.items;
  }

  clearCart(): any[] {
    throw new Error('Method not implemented.');
  }
  getShippingPrices(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}

export interface GetCartResponse {
  data: {
    _id: string;
    userId: string;
    items: Array<CartItem>;
    version: number;
  };
}
