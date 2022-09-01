import { InvalidArgumentError } from '@shared/errors/invalid-argument-error';
import { StringValueObject } from '@shared/value-objects/string-value-object';

export enum OrderStatusEnum {
  Initiated = 'initiated',
  Created = 'created',
  Cancelled = 'cancelled',
}

export const orderStatusValues = Object.values(OrderStatusEnum).map((value) => value.toString());

export class OrderStatus extends StringValueObject {
  public constructor(value: string) {
    super(value);
    this.ensureSupportedOrderStatus(value || '');
  }

  private ensureSupportedOrderStatus(value: string): void {
    if (orderStatusValues.includes(value) === false) {
      throw new InvalidArgumentError(
        `The Order Status <${value}> is invalid, supported values are: ${orderStatusValues}`
      );
    }
  }
}
