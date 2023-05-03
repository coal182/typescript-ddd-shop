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
      };
    }
  }

  public getItems(): Observable<Cart> {
    const userId = this.storageService.getItem('user_id');
    return this.http.get(`${environment.apiUrl}cart/user/${userId}`).pipe(
      map((data: GetCartResponse) => {
        return data.data;
      })
    );
  }

  public addToCart(item: CartItem): Observable<unknown> {
    const params: AddToCartParams = {
      id: this.cart.id,
      productId: item.product.id,
      qty: item.qty,
      price: item.price,
    };

    this.cart.items.push(item);
    //localStorage.setItem('cart', JSON.stringify(this.sessionCart));

    return this.http.post<any>(`${environment.apiUrl}cart/add`, params);
  }

  public removeFromCart(item: CartItem): Observable<unknown> {
    const params: AddToCartParams = {
      id: this.cart.id,
      productId: item.product.id,
      qty: item.qty,
      price: item.price,
    };

    return this.http.delete<any>(
      `${environment.apiUrl}cart/remove/${params.id}/${params.productId}/${params.qty}/${params.price}`
    );
  }

  public confirmCart(checkoutForm: FormGroup, orderId: string): Observable<unknown> {
    const confirmCartParams: ConfirmCartParams = {
      id: orderId,
      userId: this.cart.userId,
      name: checkoutForm.value.name,
      address: checkoutForm.value.address,
      total: this.totalCart(),
      lines: this.cart.items,
    };

    return this.http.post(`${environment.apiUrl}orders`, confirmCartParams);
  }

  private totalCart(): number {
    return this.cart.items.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
  }

  public clearCart(): Observable<unknown> {
    return this.http.delete<any>(`${environment.apiUrl}cart/clear/${this.cart.id}`);
  }

  public getShippingPrices(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}

export interface GetCartResponse {
  data: {
    items: CartItem[];
    userId: string;
    id: string;
    message: string;
    status: number;
  };
}
