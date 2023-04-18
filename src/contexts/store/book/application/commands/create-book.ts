import { Command } from '@core/command';

import { Commands } from '@storeback/shared/constants/commands';

export class CreateBookCommand extends Command {
  public guid: string;
  public name: string;
  public description: string;
  public image: string;
  public author: string;
  public price: number;
  // Set static name so we can refer to them easily
  public static commandName = Commands.CREATE_BOOK;

  constructor(guid: string, name: string, description: string, image: string, author: string, price: number) {
    super(guid);
    this.guid = guid;
    this.name = name;
    this.description = description;
    this.image = image;
    this.author = author;
    this.price = price;
  }
}
