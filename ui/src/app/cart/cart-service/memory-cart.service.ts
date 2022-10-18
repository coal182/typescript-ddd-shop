import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { CartItem } from '../cart';

import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class MemoryCartService extends CartService {
  items: CartItem[] = [];

  constructor(private http: HttpClient) {
    super();
  }

  addToCart(item: CartItem): void {
    this.items.push(item);
  }

  getItems() {
    return of(this.items);
  }

  confirmCart(checkoutForm: FormGroup, orderId: string): Observable<unknown> {
    throw new Error('Method not implemented.');
  }

  clearCart(): Observable<unknown> {
    this.items = [];
    return of(this.items);
  }

  getShippingPrices() {
    return this.http.get<{ type: string; price: number }[]>('/assets/shipping.json');
  }
}
