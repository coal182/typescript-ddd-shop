import { Observable, of } from "rxjs";
import { CartService } from "../cart/cart-service/cart.service";

export class MockCartService implements CartService{
    addToCart = jasmine.createSpy('addToCart').and.returnValue(of({}))
    getItems = jasmine.createSpy('getItems').and.returnValue(of({}));
    confirmCart = jasmine.createSpy('confirmCart').and.returnValue(of({}));
    clearCart = jasmine.createSpy('clearCart').and.returnValue(of({}));
    getShippingPrices = jasmine.createSpy('getShippingPrices').and.returnValue(of({}));
}