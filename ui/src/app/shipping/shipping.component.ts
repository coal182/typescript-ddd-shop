import { Component } from '@angular/core';

import { HttpCartService } from '../cart/cart-service/http-cart.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
})
export class ShippingComponent {
  shippingCosts = this.cartService.getShippingPrices();

  constructor(private cartService: HttpCartService) {}
}
