import { HttpClient } from '@angular/common/http';
import { fakeAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { MockLocalStorageService } from 'src/app/test/mock-local-storage-service';
import { environment } from 'src/environments/environment';

import { AddToCartParams, CartItem } from '../interfaces/cart';

import { CartService, ConfirmCartParams } from './cart.service';
import { HttpCartService } from './http-cart.service';

fdescribe('HttpCartService', () => {
  let service: CartService;

  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let localStorageMock: MockLocalStorageService;

  const cartId = 'cart-id';
  const userId = 'user-id';
  const productId = 'product-id';

  const testCart = {
    id: cartId,
    userId: userId,
    items: [],
  };

  const testItem: CartItem = {
    product: {
      id: productId,
      name: 'product-name',
      description: 'product-description',
      image: 'product-image',
      price: 5.45,
      brand: 'brand',
      category: 'category',
      ean: 'ean',
    },
    qty: 5,
    price: 5.45,
  };

  const testItem2: CartItem = {
    product: {
      id: 'product-id-2',
      name: 'product-name-2',
      description: 'product-description',
      image: 'product-image',
      price: 6,
      brand: 'brand',
      category: 'category',
      ean: 'ean',
    },
    qty: 2,
    price: 6,
  };

  const fb = new FormBuilder();
  const checkoutForm = fb.group({
    name: ['Cristian'],
    address: ['C/ Barca'],
  });

  beforeEach(() => {
    initializeCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to add a product to the cart', () => {
    const expectedParams: AddToCartParams = {
      id: cartId,
      productId: productId,
      qty: 5,
      price: 5.45,
    };

    it('should call the api with expected params', async () => {
      await service.addToCart(testItem);

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}cart/add`, expectedParams);
    });
  });

  describe('when asked to checkout cart', () => {
    describe('and cart is empty', () => {
      it('should not call the api', () => {
        expect(httpClientSpy.post.calls.count()).toBe(0);
      });
    });

    describe('and cart is not empty', async () => {
      it('should call the api with expected params and clear the cart', fakeAsync(() => {
        service.addToCart(testItem);
        service.addToCart(testItem2);
        const orderId = uuidv4();
        service.confirmCart(checkoutForm, orderId);

        const expectedParamsFirstCall: AddToCartParams = {
          id: cartId,
          productId: productId,
          qty: 5,
          price: 5.45,
        };
        const expectedParamsSecondCall: AddToCartParams = {
          id: cartId,
          productId: testItem2.product.id,
          qty: testItem2.qty,
          price: testItem2.price,
        };
        const expectedParamsThirdCall: ConfirmCartParams = {
          id: orderId,
          userId,
          name: 'Cristian',
          address: 'C/ Barca',
          total: 39.25,
          lines: [testItem, testItem2],
        };

        expect(httpClientSpy.post.calls.allArgs()).toEqual([
          [`${environment.apiUrl}cart/add`, expectedParamsFirstCall],
          [`${environment.apiUrl}cart/add`, expectedParamsSecondCall],
          [`${environment.apiUrl}orders`, expectedParamsThirdCall],
        ]);
      }));
    });
  });

  describe('when asked to clear the car', () => {
    describe('and cart is empty', () => {
      it('should not call the api', () => {
        expect(httpClientSpy.delete.calls.count()).toBe(0);
      });
    });

    describe('and cart is not empty', async () => {
      it('should call the api with expected parameters', () => {
        service.clearCart();
        expect(httpClientSpy.delete).toHaveBeenCalledWith(`${environment.apiUrl}cart/clear/${cartId}`);
      });
    });
  });

  function initializeCart() {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'delete']);
    httpClientSpy.post.and.returnValue(of(true));
    httpClientSpy.delete.and.returnValue(of(true));
    localStorageMock = new MockLocalStorageService();
    localStorageMock.setItem('cart', JSON.stringify(testCart));
    service = new HttpCartService(httpClientSpy, localStorageMock);
  }
});
