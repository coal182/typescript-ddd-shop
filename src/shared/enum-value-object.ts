export abstract class EnumValueObject<T> {
    public readonly value: T;

    public constructor(value: T, public readonly validValues: T[]) {
        this.value = value;
        this.checkValueIsValid(value);
    }

    public checkValueIsValid(value: T): void {
        if (!this.validValues.includes(value)) {
            this.throwErrorForInvalidValue(value);
        }
    }

    protected abstract throwErrorForInvalidValue(value: T): void;
}
