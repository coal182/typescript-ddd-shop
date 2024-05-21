import {IdProvider} from '@domain/id-provider';
import {Primitives} from '@domain/value-objects/primitives-type';
import {Command} from '@shared/domain/command';
import {Type, array, number, string, type} from 'io-ts';

export const createProductCodec: Type<Primitives<CreateProductCommand>> = type({
    id: string,
    name: string,
    description: string,
    images: array(string),
    price: number,
    brand: string,
    category: string,
    ean: string,
});

export class CreateProductCommand extends Command {
    public id: string;
    public name: string;
    public description: string;
    public images: string[];
    public price: number;
    public brand: string;
    public category: string;
    public ean: string;

    constructor(id: string, name: string, description: string, images: string[], price: number, brand: string, category: string, ean: string) {
        super();
        this.id = id || IdProvider.getId();
        this.name = name;
        this.description = description;
        this.images = images;
        this.price = price;
        this.brand = brand;
        this.category = category;
        this.ean = ean;
    }
}
