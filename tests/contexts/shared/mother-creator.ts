import {Faker, faker} from '@faker-js/faker';

export class MotherCreator {
    static random(): Faker {
        return faker;
    }
}
