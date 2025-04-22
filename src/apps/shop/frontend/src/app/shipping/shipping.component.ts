import {Component} from '@angular/core';

import {HttpCartService} from '../cart/services/http-cart.service';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.css'],
    standalone: false
})
export class ShippingComponent {
    shippingCosts = this.cartService.getShippingPrices();

    constructor(private cartService: HttpCartService) {}
}
