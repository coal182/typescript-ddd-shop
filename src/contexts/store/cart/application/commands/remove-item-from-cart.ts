import { Command } from '@core/command';

export class RemoveItemFromCartCommand extends Command {
  public bookId: string;
  public qty: number;
  public price: number;

  public static commandName = RemoveItemFromCartCommand.name;

  constructor(guid: string, bookId: string, qty: number, price: number, public readonly originalVersion: number) {
    super(guid);
    this.bookId = bookId;
    this.qty = qty;
    this.price = price;
    this.originalVersion = originalVersion;
  }
}
