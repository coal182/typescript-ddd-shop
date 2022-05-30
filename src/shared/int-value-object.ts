export abstract class NumberValueObject {
    public readonly value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public equalsTo(other: NumberValueObject): boolean {
        return this.value === other.value;
    }

    public isBiggerThan(other: NumberValueObject): boolean {
        return this.value > other.value;
    }
}
