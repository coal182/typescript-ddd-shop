import {MotherCreator} from './mother-creator';

export class EmailMother {
    static random(): string {
        return MotherCreator.random().internet.email();
    }
}
