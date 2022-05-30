export abstract class StringValueObject {
    public readonly value: string;

    public constructor(value: string) {
        this.value = value;
    }

    public toString(): string {
        return this.value;
    }
}
