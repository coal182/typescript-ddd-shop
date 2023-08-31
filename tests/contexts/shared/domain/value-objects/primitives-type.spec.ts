import { expectTypeOf } from 'expect-type';

import { Primitives } from '@domain/value-objects/primitives-type';
import { Cart } from '@shop-backend/cart/domain/cart';
import { Order } from '@shop-backend/order/domain/order';
import { Product } from '@shop-backend/product/domain/product';
import { User } from '@shop-backend/user/domain/user';

describe('Primitives', () => {
  it('should ensure to only return primitive properties excluding methods', () => {
    type actualPrimitives = Primitives<User>;

    type expectedPrimitives = {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      dateOfBirth: Date;
      password: string;
    };

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should get primitive array type from value object array', () => {
    type actualPrimitives = Primitives<Product>;

    type expectedPrimitives = {
      id: string;
      name: string;
      description: string;
      images: string[];
      price: number;
      brand: string;
      category: string;
      ean: string;
      active: boolean;
      createdAt: Date;
    };

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should generate nested primitive object', () => {
    type actualPrimitives = Primitives<Order>;

    type expectedPrimitives = {
      id: string;
      name: string;
      userId: string;
      status: string;
      address: {
        number: number;
        street: string;
        city: string;
      };
      total: number;
      lines: {
        productId: string;
        qty: number;
        price: number;
        product?:
          | {
              id: string;
              name: string;
              description: string;
              images: string[];
              price: number;
              brand: string;
              category: string;
              ean: string;
            }
          | undefined;
      }[];
    };

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should generate nested primitive type from array of value objects prop', () => {
    type actualPrimitives = Primitives<Cart>;

    type expectedPrimitives = {
      id: string;
      userId: string;
      items: {
        productId: string;
        qty: number;
        price: number;
        product?:
          | {
              id: string;
              name: string;
              description: string;
              images: string[];
              price: number;
              brand: string;
              category: string;
              ean: string;
            }
          | undefined;
      }[];
    };

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should get primitive type in case it is not a value object', () => {
    type actualPrimitives = Primitives<Product>;

    type expectedPrimitives = {
      id: string;
      name: string;
      description: string;
      images: string[];
      price: number;
      brand: string;
      category: string;
      ean: string;
      active: boolean;
      createdAt: Date;
    };

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should infer the optional properties', () => {
    type actualPrimitives = Primitives<Cart>;

    type expectedPrimitives = {
      id: string;
      userId: string;
      items: {
        productId: string;
        qty: number;
        price: number;
        product?:
          | {
              id: string;
              name: string;
              description: string;
              images: string[];
              price: number;
              brand: string;
              category: string;
              ean: string;
            }
          | undefined;
      }[];
    };

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });
});
