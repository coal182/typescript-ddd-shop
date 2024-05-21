import {MotherCreator} from './mother-creator';

export class WordMother {
    static random(): string {
        return MotherCreator.random().lorem.word();
    }
}
