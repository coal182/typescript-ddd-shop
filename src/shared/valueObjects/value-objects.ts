export class ValueObject<T> {
  private value: T;

  public constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }
}
