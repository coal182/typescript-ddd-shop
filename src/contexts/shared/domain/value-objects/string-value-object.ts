export abstract class StringValueObject {
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public equals(other: StringValueObject): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value;
  }

  public toString(): string {
    return this.value;
  }
}
