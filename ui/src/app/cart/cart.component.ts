import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CartItem } from './cart';

import { HttpCartService } from './cart-service/http-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  items: CartItem[];
  columnsToDisplay = ['name', 'qty', 'price', 'actions'];
  @ViewChild(MatTable) table!: MatTable<CartItem>;
  checkoutForm = this.formBuilder.group({
    name: '',
    address: '',
  });

  constructor(
    private cartService: HttpCartService,
    private formBuilder: FormBuilder
  ) {
    this.items = this.cartService.getItems();
    
  }

  ngOnInit(): void {
    this.table.renderRows();
  }

  onSubmit(): void {
    // Process checkout data here
    this.items = this.cartService.clearCart();
    console.warn('Your order has been submitted', this.checkoutForm.value);
    this.checkoutForm.reset();
  }

  removeFromCart(item: CartItem): void {
    this.items = this.cartService.removeFromCart(item);  
    this.items = this.items.filter(
      (it) => it.product._id !== item.product._id
    );  
  }

}
