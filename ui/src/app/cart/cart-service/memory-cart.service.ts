import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../products/products';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { CartService } from './cart.service';
import { CartItem } from '../cart';

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

  confirmCart(): Array<any> {
    throw new Error('Method not implemented.');
  }
  
  clearCart() {
    this.items = [];
    return this.items;
  }

  getShippingPrices() {
    return this.http.get<{ type: string; price: number }[]>(
      '/assets/shipping.json'
    );
  }

}
