import { StringValueObject } from '../value-objects/string-value-object';

export class OrderBy extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
