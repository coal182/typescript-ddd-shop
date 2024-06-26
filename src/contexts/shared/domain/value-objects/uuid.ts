import {InvalidArgumentError} from '@shared/domain/errors/invalid-argument-error';
import {v4} from 'uuid';
import validate from 'uuid-validate';

export class Uuid {
    public readonly value: string;

    public constructor(value: string) {
        this.ensureIsValidUuid(value);

        this.value = value;
    }

    public static random(): Uuid {
        return new Uuid(v4());
    }

    private ensureIsValidUuid(id: string): void {
        if (!validate(id)) {
            throw new InvalidArgumentError(`<${this.constructor.name}> does not allow the value <${id}>`);
        }
    }

    public toString(): string {
        return this.value;
    }
}
