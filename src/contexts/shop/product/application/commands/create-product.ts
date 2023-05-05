import { v4 as uuidv4 } from 'uuid';

import { Command } from '@shared/domain/command';

export class CreateProductCommand extends Command {
  public id: string;
  public name: string;
  public description: string;
  public image: string;
  public price: number;
  public brand: string;
  public category: string;
  public ean: string;

  constructor(
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    brand: string,
    category: string,
    ean: string
  ) {
    super();
    this.id = id || uuidv4();
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.ean = ean;
  }
}
