import { ProductResponse } from '@shop-backend/product/application/product-response';

export class OrderLine {
  public productId: string;
  public qty: number;
  public price: number;
  public product?: ProductResponse;

  constructor(productId: string, qty: number, price: number, product?: ProductResponse) {
    this.productId = productId;
    this.qty = qty;
    this.price = price;
    if (product) {
      this.product = product;
    }
  }
}
