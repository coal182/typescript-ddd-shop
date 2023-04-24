import { InvalidArgumentError } from '@shared/domain/errors/invalid-argument-error';

export class DateValueObject {
  public readonly value: Date;

  public constructor(value: Date) {
    this.ensureIsValidDate(value);

    this.value = value;
  }

  private ensureIsValidDate(date: Date): void {
    if (Object.prototype.toString.call(date) !== '[object Date]') {
      throw new InvalidArgumentError(`<${this.constructor.name}> does not allow the value <${date}>`);
    }
  }

  public toString(): string {
    return this.value.toDateString();
  }
}
