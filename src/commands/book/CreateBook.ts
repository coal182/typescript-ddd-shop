import { Commands } from '@constants/commands';
import { Command } from '@core/Command';

export class CreateBookCommand extends Command {
  public guid: string;
  public name: string;
  public description: string;
  public image: string;
  public authorId: string;
  public price: number;
  // Set static name so we can refer to them easily
  public static commandName = Commands.CREATE_BOOK;

  constructor(guid: string, name: string, description: string, image: string, authorId: string, price: number) {
    super(guid);
    this.guid = guid;
    this.name = name;
    this.description = description;
    this.image = image;
    this.authorId = authorId;
    this.price = price;
  }
}
