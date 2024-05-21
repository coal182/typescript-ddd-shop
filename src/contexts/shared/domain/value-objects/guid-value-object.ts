export abstract class GuidValueObject {
    public readonly value: string | undefined;

    public constructor(value: string | undefined) {
        this.value = value;
    }

    public toString(): string | undefined {
        return this.value;
    }
}
