import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of, throwError } from 'rxjs';
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
  items: Observable<CartItem>[] = []; 
  cart: Cart; 
  public constructor(private http: HttpClient) {
    super();
  }

  public getItems(): Observable<CartItem>[] {
    this.items = [];
    const userId = localStorage.getItem('user_id');
    this.http.get(
      `https://ts-bookstore-api.herokuapp.com/api/v1/cart/user/${userId}`
    ).subscribe((data: GetCartResponse) => {
      data.data.items.map((item: CartItem) => {
        this.items.push(of(item));
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
          this.cart.version = this.cart.version++;          
          this.items.push(of(item));

          Swal.fire(
            'Success!',
            'Product added to cart!',
            'success'
          );  
        
        });

    });
    
  }

  removeFromCart(item: Observable<CartItem>): void {
    item.subscribe((item: CartItem) => {
      alert("removed");
      const params: AddToCartParams = {
        guid: this.cart._id,
        bookId: item.product._id,
        qty: item.qty,
        price: item.price,
        originalVersion: this.cart.version
      }
      
      let httpParams = new HttpParams({fromObject: {...params}});
      let options = { params: httpParams };

      this.http
        .delete<any>(`https://ts-bookstore-api.herokuapp.com/api/v1/cart/remove`, options)
        .pipe(
          catchError((error: HttpErrorResponse): Observable<Error> => {
            return throwError(() => error);
          })
        )
        .subscribe((res: any) => {
          this.cart.version = this.cart.version++;          
          this.items.push(of(item));

          Swal.fire(
            'Success!',
            'Product removed from cart!',
            'success'
          );  
        
        });

      });
  
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
