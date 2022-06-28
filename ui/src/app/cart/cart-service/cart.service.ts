import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../../cart/cart';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Product } from 'src/app/products/products';

@Injectable({
  providedIn: 'root',
})
export abstract class CartService {

  abstract addToCart(product: Observable<Product>) : void;

  abstract getItems(): CartItem[];

  abstract clearCart(): Array<any>;

  abstract getShippingPrices(): Observable<any>;
}

export interface GetCartParams {
  userId: string;
}