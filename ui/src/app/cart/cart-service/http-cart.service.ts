import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { StorageService } from 'src/app/shared/services/storage.service';

import { environment } from '../../../environments/environment';
import { AddToCartParams, Cart, CartItem, SessionCart } from '../cart';

import { CartService, ConfirmCartParams } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class HttpCartService extends CartService {
  cart: Cart;
  sessionCart: SessionCart;

  public constructor(private http: HttpClient, @Inject('StorageService') private storageService: StorageService) {
    super();
    this.initCart();
  }

  private initCart(): void {
    if (!this.cart && this.storageService.getItem('cart') !== null) {
      this.sessionCart = JSON.parse(this.storageService.getItem('cart'));

      this.cart = {
        id: this.sessionCart.id,
        userId: this.sessionCart.userId,
        items: [],
        version: this.sessionCart.version,
      };
    }
  }

  public getItems(): Observable<Cart> {
    const userId = this.storageService.getItem('user_id');
    return this.http.get(`${environment.apiUrl}api/v1/cart/user/${userId}`).pipe(
      map((data: GetCartResponse) => {
        return data.data;
      })
    );
  }

  public addToCart(item: CartItem): Observable<unknown> {
    const params: AddToCartParams = {
      guid: this.cart.id,
      bookId: item.product.id,
      qty: item.qty,
      price: item.price,
      originalVersion: this.cart.version,
    };

    this.cart.items.push(item);
    this.cart.version = this.cart.version + 1;
    this.sessionCart.version = this.sessionCart.version + 1;
    //TODO: Fix cart version problem
    //localStorage.setItem('cart', JSON.stringify(this.sessionCart));

    return this.http.post<any>(`${environment.apiUrl}api/v1/cart/add`, params);
  }

  public removeFromCart(item: CartItem): Observable<unknown> {
    const params: AddToCartParams = {
      guid: this.cart.id,
      bookId: item.product.id,
      qty: item.qty,
      price: item.price,
      originalVersion: this.cart.version,
    };

    return this.http.delete<any>(
      `${environment.apiUrl}api/v1/cart/remove/${params.guid}/${params.bookId}/${params.qty}/${params.price}/${params.originalVersion}`
    );
  }

  public confirmCart(checkoutForm: FormGroup, orderId: string): Observable<unknown> {
    const confirmCartParams: ConfirmCartParams = {
      guid: orderId,
      userId: this.cart.userId,
      name: checkoutForm.value.name,
      address: checkoutForm.value.address,
      total: this.totalCart(),
      lines: this.cart.items,
    };

    return this.http.post(`${environment.apiUrl}api/v1/orders`, confirmCartParams);
  }

  private totalCart(): number {
    return this.cart.items.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
  }

  public clearCart(): Observable<unknown> {
    return this.http.delete<any>(`${environment.apiUrl}api/v1/cart/clear/${this.cart.id}/${this.cart.version}`);
  }

  public getShippingPrices(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}

export interface GetCartResponse {
  data: {
    items: CartItem[];
    userId: string;
    version: number;
    id: string;
    message: string;
    status: number;
  };
}
