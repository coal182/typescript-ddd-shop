import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { MockLocalStorageService } from 'src/app/test/mock-local-storage-service';
import { environment } from 'src/environments/environment';
import { AddToCartParams, CartItem } from '../cart';

import { CartService } from './cart.service';
import { HttpCartService } from './http-cart.service';

fdescribe('HttpCartService', () => {
  let cartService: CartService;
  let http: HttpClient;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let localStorageMock: MockLocalStorageService;

  const cartId = 'cart-guid';
  const userId = 'user-guid';
  const productId = 'product-guid';
  const productName = 'product-name';

  const testCart = {
    id : cartId,
    userId : userId,
    items : [],
    version : 0          
  }

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    localStorageMock = new MockLocalStorageService();
    localStorageMock.setItem('cart', JSON.stringify(testCart));
    cartService = new HttpCartService(httpClientSpy, localStorageMock);
  });

  it('should be created', () => {
    expect(cartService).toBeTruthy();
  });

  describe('when asked to add a product to the cart', () => {
    const testItem: CartItem = {
        product: {
          id: 'product-guid',
          name: 'product-name',
          author: {
            id: 'author-guid',
            firstname: 'Pablo',
            lastname: 'Neruda',
          },
          price: 5.45,
          version: 0,
        },
        qty: 5,
        price: 5.45
    }
    const expectedParams: AddToCartParams = {
      guid: cartId,
      bookId: 'product-guid',
      qty: 5,
      price: 5.45,
      originalVersion: 0
    }    

    it('should call the api with expected params', async () => {
      await cartService.addToCart(testItem);
      console.log(localStorageMock.getItem('cart'))
      expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}api/v1/cart/add`, expectedParams)
    });
  });
  
  describe('when asked to checkout cart', () => {
    describe('and cart is empty', () => {
      it('should not call the api', () => {
        expect(httpClientSpy.post.calls.count()).toBe(0);
      });
    });
    describe('and cart is not empty', () => {
      it('should call the api with expected params', () => {
        expect(true).toBe(false)
      });
      it('should emptying the cart', () => {
        expect(true).toBe(false)
      });  
    });
      
  });
  
});
