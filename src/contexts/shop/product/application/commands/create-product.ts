import { IdProvider } from '@domain/id-provider';
import { Command } from '@shared/domain/command';

export class CreateProductCommand extends Command {
  public id: string;
  public name: string;
  public description: string;
  public images: string[];
  public price: number;
  public brand: string;
  public category: string;
  public ean: string;

  constructor(
    id: string,
    name: string,
    description: string,
    images: string[],
    price: number,
    brand: string,
    category: string,
    ean: string
  ) {
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
