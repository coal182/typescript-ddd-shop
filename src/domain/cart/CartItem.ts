export class CartItem {
  public bookId: string;
  public qty: number;
  public price: number;

  constructor(bookId: string, qty: number, price: number) {
    this.bookId = bookId;
    this.qty = qty;
    this.price = price;
  }
}
