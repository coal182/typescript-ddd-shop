import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { StorageService } from 'src/app/shared/services/storage.service';

import { environment } from '../../../environments/environment';
import { AddToCartParams, Cart, CartItem, SessionCart } from '../interfaces/cart';

import { CartService, ConfirmCartParams } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class HttpCartService extends CartService {
  public cart: Cart;
  public sessionCart: SessionCart;
  private cartSubject = new BehaviorSubject<Cart>({ id: '', userId: '', items: [], total: 0 });

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
        total: 0,
      };
    }
  }

  public getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  public getItems(): Observable<Cart> {
    const userId = this.storageService.getItem('user_id');
    return this.http.get(`${environment.apiUrl}cart/user/${userId}`).pipe(
      map((data: GetCartResponse) => {
        this.cart = {
          ...data.data,
          total: 0,
        };
        this.totalize();
        this.cartSubject.next(this.cart);
        return this.cart;
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
    this.cartSubject.next(this.cart);

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

    return this.http
      .delete<any>(`${environment.apiUrl}cart/remove/${params.id}/${params.productId}/${params.qty}/${params.price}`)
      .pipe(
        tap(() => {
          this.cart.items = this.cart.items.filter((it) => it.product.id !== item.product.id);
          this.totalize();
        })
      );
  }

  public confirmCart(checkoutForm: FormGroup, orderId: string): Observable<unknown> {
    const confirmCartParams: ConfirmCartParams = {
      id: orderId,
      userId: this.cart.userId,
      name: checkoutForm.value.name,
      address: checkoutForm.value.address,
      total: this.cart.total,
      lines: this.cart.items,
    };

    return this.http.post(`${environment.apiUrl}order`, confirmCartParams);
  }

  private totalize(): void {
    this.cart = { ...this.cart, total: this.cart.items.reduce((acc, cur) => acc + cur.price * cur.qty, 0) };
    this.cartSubject.next(this.cart);
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
