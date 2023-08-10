import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { CartItem } from '../interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export abstract class CartService {
  abstract addToCart(item: CartItem): void;

  abstract getItems(): Observable<unknown>;

  abstract confirmCart(checkoutForm: UntypedFormGroup, orderId: string): Observable<unknown>;

  abstract clearCart(): Observable<unknown>;

  abstract getShippingPrices(): Observable<any>;
}

export interface GetCartParams {
  userId: string;
}

export interface ConfirmCartParams {
  id: string;
  userId: string;
  name: string;
  address: string;
  total: number;
  lines: Array<CartItem>;
}
