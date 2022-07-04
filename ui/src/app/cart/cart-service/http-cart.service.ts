import { EventEmitter, Injectable, Output } from '@angular/core';
import { catchError, filter, firstValueFrom, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {
  CartService,
  GetCartParams
} from './cart.service';

import { AddToCartParams, Cart, CartItem } from '../cart';

@Injectable({
  providedIn: 'root',
})
export class HttpCartService extends CartService {
  cart: Cart; 

  public constructor(private http: HttpClient) {
    super();
  }

  public getItems(): Observable<Object> {

    const userId = localStorage.getItem('user_id');
    return this.http.get(
      `https://ts-bookstore-api.herokuapp.com/api/v1/cart/user/${userId}`
    ).pipe(
      map((data: GetCartResponse) => { return data.data; })
    );

  }

  addToCart(item: CartItem): Observable<Object> {

      const params: AddToCartParams = {
        guid: this.cart._id,
        bookId: item.product._id,
        qty: item.qty,
        price: item.price,
        originalVersion: this.cart.version
      }
      
       return this.http
        .post<any>(`https://ts-bookstore-api.herokuapp.com/api/v1/cart/add`, params);
    
  }

  removeFromCart(item: CartItem): Observable<Object> {
    const params: AddToCartParams = {
      guid: this.cart._id,
      bookId: item.product._id,
      qty: item.qty,
      price: item.price,
      originalVersion: this.cart.version
    }

    return this.http
      .delete<any>(`https://ts-bookstore-api.herokuapp.com/api/v1/cart/remove/${params.guid}/${params.bookId}/${params.qty}/${params.price}/${params.originalVersion}`);
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
    items: CartItem[],
    userId: string,
    version: number
    _id: string
    message: string
    status: number
  };
}
