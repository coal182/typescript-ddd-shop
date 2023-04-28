export class OrderLine {
  public productId: string;
  public qty: number;
  public price: number;

  constructor(productId: string, qty: number, price: number) {
    this.productId = productId;
    this.qty = qty;
    this.price = price;
  }
}
