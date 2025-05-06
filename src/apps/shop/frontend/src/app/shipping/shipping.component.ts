import {AsyncPipe, CurrencyPipe} from '@angular/common';
import {Component} from '@angular/core';

import {HttpCartService} from '../cart/services/http-cart.service';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.css'],
    imports: [CurrencyPipe, AsyncPipe],
})
export class ShippingComponent {
    shippingCosts$ = this.cartService.getShippingPrices();

    constructor(private cartService: HttpCartService) {}
}
