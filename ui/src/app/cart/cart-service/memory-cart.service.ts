import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../products/products';
import { firstValueFrom, map, Observable } from 'rxjs';
import { CartService } from './cart.service';
import { CartItem } from '../cart';

@Injectable({
  providedIn: 'root',
})
export class MemoryCartService extends CartService {
  items: Observable<CartItem>[] = [];

  constructor(private http: HttpClient) {
    super();
  }

  addToCart(product: Observable<Product>): void {
    product.pipe(
      map((pro): CartItem => ({product: pro, qty: 1, price: pro.price }))
    );
  }

  getItems() {
    return this.items;
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
