import { v4 as uuidv4 } from 'uuid';

import { Command } from '@shared/domain/Command';

export class CreateBookCommand extends Command {
  public id: string;
  public name: string;
  public description: string;
  public image: string;
  public author: string;
  public price: number;

  constructor(id: string, name: string, description: string, image: string, author: string, price: number) {
    super();
    this.id = id || uuidv4();
    this.name = name;
    this.description = description;
    this.image = image;
    this.author = author;
    this.price = price;
  }
}
