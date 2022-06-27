import { Command } from '@core/Command';

export class AddItemToCartCommand extends Command {
  public bookId: string;
  public qty: number;
  public price: number;

  public static commandName = AddItemToCartCommand.name;

  constructor(guid: string, bookId: string, qty: number, price: number, public readonly originalVersion: number) {
    super(guid);
    this.bookId = bookId;
    this.qty = qty;
    this.price = price;
    this.originalVersion = originalVersion;
  }
}
