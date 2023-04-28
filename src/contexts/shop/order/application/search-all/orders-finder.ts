import { OrderRepository } from '../../domain/order-repository';

export class OrdersFinder {
  constructor(private orderRepository: OrderRepository) {}

  async run() {
    const orders = await this.orderRepository.searchAll();

    return orders;
  }
}
