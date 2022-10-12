import { EventEmitter, Inject, Injectable, Output } from '@angular/core';
import { catchError, filter, firstValueFrom, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import * as uuid from 'uuid';
import {
  CartService,
  ConfirmCartParams,
  GetCartParams
} from './cart.service';

import { AddToCartParams, Cart, CartItem } from '../cart';

import { environment } from '../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpCartService extends CartService {
  cart: Cart; 

  public constructor(
    private http: HttpClient, 
    @Inject('StorageService') private storageService: StorageService
  ) {
    super();
    if (!this.cart && storageService.getItem('cart') !== null) {
      const sessionCart = JSON.parse(storageService.getItem('cart'));
      
      this.cart = {
        id : sessionCart.id,
        userId : sessionCart.userId,
        items : [],
        version : sessionCart.version          
      }    
    }
  }

  public getItems(): Observable<Cart> {
    const userId = this.storageService.getItem('user_id');
    return this.http.get(
      `${environment.apiUrl}api/v1/cart/user/${userId}`
    ).pipe(
      map((data: GetCartResponse) => { return data.data; })
    );

  }

  addToCart(item: CartItem): Observable<Object> {

    const params: AddToCartParams = {
      guid: this.cart.id,
      bookId: item.product.id,
      qty: item.qty,
      price: item.price,
      originalVersion: this.cart.version
    }
    console.log("🚀 ~ file: http-cart.service.ts ~ line 56 ~ HttpCartService ~ addToCart ~ params", params)
    
    return this.http
      .post<any>(`${environment.apiUrl}api/v1/cart/add`, params);

  }

  removeFromCart(item: CartItem): Observable<Object> {
    const params: AddToCartParams = {
      guid: this.cart.id,
      bookId: item.product.id,
      qty: item.qty,
      price: item.price,
      originalVersion: this.cart.version
    }

    return this.http
      .delete<any>(`${environment.apiUrl}api/v1/cart/remove/${params.guid}/${params.bookId}/${params.qty}/${params.price}/${params.originalVersion}`);
  }
  
  confirmCart(checkoutForm: ConfirmCartParams): Array<any> {
    throw new Error('Method not implemented.');
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
    id: string
    message: string
    status: number
  };
}
