import { expectTypeOf } from 'expect-type';

import { Primitives } from '@domain/value-objects/primitives-type';
import { CartModel, CartPrimitives } from '@shop-backend/cart/domain/cart';
import { OrderModel, OrderPrimitives } from '@shop-backend/order/domain/order';
import { ProductModel, ProductPrimitives } from '@shop-backend/product/domain/product';
import { UserInterface, UserPrimitives } from '@shop-backend/user/domain/user';

describe('Primitives', () => {
  it('should ensure to only return primitive properties excluding methods', () => {
    type actualPrimitives = Primitives<UserInterface>;

    type expectedPrimitives = UserPrimitives;

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should get primitive array type from value object array', () => {
    type actualPrimitives = Primitives<ProductModel>;

    type expectedPrimitives = ProductPrimitives;

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should generate nested primitive object', () => {
    type actualPrimitives = Primitives<OrderModel>;

    type expectedPrimitives = OrderPrimitives;

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should generate nested primitive type from array of value objects prop', () => {
    type actualPrimitives = Primitives<CartModel>;

    type expectedPrimitives = CartPrimitives;

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should get primitive type in case it is not a value object', () => {
    type actualPrimitives = Primitives<ProductModel>;

    type expectedPrimitives = ProductPrimitives;

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });

  it('should infer the optional properties', () => {
    type actualPrimitives = Primitives<CartModel>;

    type expectedPrimitives = CartPrimitives;

    expectTypeOf<actualPrimitives>().toEqualTypeOf<expectedPrimitives>();
  });
});
