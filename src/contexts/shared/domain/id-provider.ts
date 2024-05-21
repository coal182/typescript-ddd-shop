import {v4 as uuidv4} from 'uuid';

export class IdProvider {
    static getId(): string {
        return uuidv4();
    }
}
